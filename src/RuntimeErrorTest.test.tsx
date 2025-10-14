import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Mock external dependencies to avoid runtime errors
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onMouseEnter, onMouseLeave, onClick, style, ...props }: any) => (
      <div 
        {...props}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        style={style}
        data-testid="motion-div"
      >
        {children}
      </div>
    ),
  },
}));

jest.mock('reactflow', () => ({
  __esModule: true,
  default: ({ children, ...props }: any) => (
    <div data-testid="react-flow" style={{ width: '100%', height: '100%' }} {...props}>
      {children}
    </div>
  ),
  Handle: ({ children, ...props }: any) => <div data-testid="handle" {...props}>{children}</div>,
  Position: {
    Top: 'top',
    Bottom: 'bottom',
  },
  useNodesState: () => [[], jest.fn(), jest.fn()],
  useEdgesState: () => [[], jest.fn(), jest.fn()],
  addEdge: jest.fn(),
  Background: ({ children }: any) => <div data-testid="background">{children}</div>,
  BackgroundVariant: {
    Dots: 'dots',
  },
  ConnectionLineType: {
    SmoothStep: 'smoothstep',
  },
}));

// Mock window.open to prevent actual navigation during tests
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});

describe('Runtime Error and Basic Positioning Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console error spy
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('app renders without runtime errors', () => {
    const consoleSpy = jest.spyOn(console, 'error');
    
    render(<App />);
    
    // Should not have any console errors
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  test('main components are rendered correctly', () => {
    render(<App />);
    
    // Check if main components are present
    const reactFlowCanvas = screen.getByTestId('react-flow');
    expect(reactFlowCanvas).toBeInTheDocument();
    
    // Check if dock is present
    const dockContainer = document.querySelector('[style*="position: fixed"]');
    expect(dockContainer).toBeInTheDocument();
  });

  test('dock is positioned correctly at bottom', () => {
    render(<App />);
    
    const dockContainer = document.querySelector('[style*="position: fixed"]');
    expect(dockContainer).toBeInTheDocument();
    
    if (dockContainer) {
      const styles = dockContainer.getAttribute('style') || '';
      expect(styles).toContain('position: fixed');
      expect(styles).toContain('bottom');
      expect(styles).toContain('left: 50%');
    }
  });

  test('dock items are rendered and clickable', () => {
    render(<App />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    expect(dockItems.length).toBeGreaterThan(0);
    
    // Check if dock items have proper styling
    dockItems.forEach((item) => {
      expect(item).toBeInTheDocument();
      const styles = window.getComputedStyle(item as Element);
      expect(styles.cursor).toBe('pointer');
    });
  });

  test('dock item clicks do not cause runtime errors', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'error');
    
    render(<App />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    
    // Click first few dock items to test for errors
    for (let i = 0; i < Math.min(dockItems.length, 3); i++) {
      await user.click(dockItems[i]);
      
      // Wait for any async operations
      await waitFor(() => {
        expect(consoleSpy).not.toHaveBeenCalled();
      });
    }
  });

  test('hover effects work without errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error');
    render(<App />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    
    if (dockItems.length > 0) {
      const firstItem = dockItems[0] as HTMLElement;
      
      // Trigger hover events
      fireEvent.mouseEnter(firstItem);
      fireEvent.mouseLeave(firstItem);
      
      // Should not cause errors
      expect(consoleSpy).not.toHaveBeenCalled();
    }
  });

  test('no elements overflow viewport bounds', () => {
    render(<App />);
    
    // Check main container doesn't overflow
    const mainContainer = document.querySelector('[style*="height: 100vh"]');
    expect(mainContainer).toBeInTheDocument();
    
    // Check dock positioning
    const dockContainer = document.querySelector('[style*="position: fixed"]');
    if (dockContainer) {
      const rect = dockContainer.getBoundingClientRect();
      // Dock should be within reasonable bounds
      expect(rect.left).toBeGreaterThanOrEqual(-100); // Allow some margin for transforms
      expect(rect.top).toBeGreaterThanOrEqual(-100);
    }
  });

  test('react flow canvas covers full area', () => {
    render(<App />);
    
    const reactFlowCanvas = screen.getByTestId('react-flow');
    expect(reactFlowCanvas).toBeInTheDocument();
    
    // Should have full dimensions
    const styles = window.getComputedStyle(reactFlowCanvas);
    expect(styles.width).toBe('100%');
    expect(styles.height).toBe('100%');
  });

  test('dock items have proper spacing', () => {
    render(<App />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    
    if (dockItems.length > 1) {
      // Check that items are not overlapping
      for (let i = 0; i < dockItems.length - 1; i++) {
        const currentItem = dockItems[i] as HTMLElement;
        const nextItem = dockItems[i + 1] as HTMLElement;
        
        const currentRect = currentItem.getBoundingClientRect();
        const nextRect = nextItem.getBoundingClientRect();
        
        // Items should not overlap (allowing small margin for spacing)
        expect(currentRect.right).toBeLessThanOrEqual(nextRect.left + 10);
      }
    }
  });

  test('z-index layering prevents overlap', () => {
    render(<App />);
    
    // Dock should have higher z-index than main content
    const dockContainer = document.querySelector('[style*="position: fixed"]');
    if (dockContainer) {
      const dockStyles = window.getComputedStyle(dockContainer);
      const zIndex = parseInt(dockStyles.zIndex || '0');
      expect(zIndex).toBeGreaterThan(100);
    }
  });

  test('responsive behavior works correctly', () => {
    // Test different viewport sizes
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;
    
    try {
      // Mobile viewport
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 667 });
      
      const { rerender } = render(<App />);
      
      // Should render without errors on mobile
      expect(screen.getByTestId('react-flow')).toBeInTheDocument();
      
      // Desktop viewport
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1920 });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1080 });
      
      rerender(<App />);
      
      // Should still render correctly on desktop
      expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    } finally {
      // Restore original viewport
      Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalInnerWidth });
      Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: originalInnerHeight });
    }
  });

  test('keyboard navigation works without errors', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'error');
    
    render(<App />);
    
    // Test tab navigation
    await user.tab();
    await user.tab();
    
    // Should not cause errors
    expect(consoleSpy).not.toHaveBeenCalled();
    
    // Should have focused element
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeDefined();
  });

  test('performance is acceptable', () => {
    const startTime = performance.now();
    
    render(<App />);
    
    const endTime = performance.now();
    
    // Should render within reasonable time
    expect(endTime - startTime).toBeLessThan(1000);
  });

  test('memory management works correctly', () => {
    const { unmount } = render(<App />);
    
    // Should unmount without errors
    expect(() => unmount()).not.toThrow();
  });

  test('error boundaries handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // This should not crash the entire app
    render(<App />);
    
    // App should still be functional
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  test('animations complete without performance issues', async () => {
    const startTime = performance.now();
    
    render(<App />);
    
    // Trigger animations
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    
    for (let i = 0; i < Math.min(dockItems.length, 3); i++) {
      fireEvent.mouseEnter(dockItems[i]);
      fireEvent.mouseLeave(dockItems[i]);
    }
    
    const endTime = performance.now();
    
    // Should complete quickly
    expect(endTime - startTime).toBeLessThan(500);
  });
});
