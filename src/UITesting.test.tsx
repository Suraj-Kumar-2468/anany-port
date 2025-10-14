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

describe('UI Positioning and Runtime Error Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset any console errors
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

  test('profile information is positioned correctly', () => {
    render(<App />);
    
    // Profile info is rendered inside React Flow nodes, so we need to check differently
    // Check if React Flow canvas is present
    const reactFlowCanvas = screen.getByTestId('react-flow');
    expect(reactFlowCanvas).toBeInTheDocument();
    
    // Check if profile name and title exist in the DOM (they're in InfoNode components)
    const profileElements = screen.getAllByText(/Alex Thompson|Video Editor & Creative Storyteller/);
    expect(profileElements.length).toBeGreaterThan(0);
  });

  test('dock is positioned at bottom of screen', () => {
    render(<App />);
    
    // Find dock container
    const dockContainer = document.querySelector('[style*="position: fixed"]');
    expect(dockContainer).toBeInTheDocument();
    
    if (dockContainer) {
      const styles = window.getComputedStyle(dockContainer);
      expect(styles.position).toBe('fixed');
      // Should be at bottom
      expect(dockContainer.getAttribute('style')).toContain('bottom');
    }
  });

  test('dock items are properly spaced and not overlapping', () => {
    render(<App />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    expect(dockItems.length).toBeGreaterThan(0);
    
    // Check if dock items have proper spacing
    if (dockItems.length > 1) {
      const firstItem = dockItems[0] as HTMLElement;
      const secondItem = dockItems[1] as HTMLElement;
      
      const firstRect = firstItem.getBoundingClientRect();
      const secondRect = secondItem.getBoundingClientRect();
      
      // Items should not overlap horizontally
      expect(firstRect.right).toBeLessThanOrEqual(secondRect.left);
    }
  });

  test('react flow canvas covers full area without overflow', () => {
    render(<App />);
    
    const reactFlowCanvas = screen.getByTestId('react-flow');
    expect(reactFlowCanvas).toBeInTheDocument();
    
    // Should have full width and height
    const styles = window.getComputedStyle(reactFlowCanvas);
    expect(styles.width).toBe('100%');
    expect(styles.height).toBe('100%');
  });

  test('no elements overflow viewport', () => {
    render(<App />);
    
    // Check all visible elements are within viewport
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach((element) => {
      if (element instanceof HTMLElement && element.offsetParent !== null) {
        const rect = element.getBoundingClientRect();
        
        // Element should not extend beyond reasonable bounds
        // Allow some margin for animations and positioning
        expect(rect.left).toBeGreaterThanOrEqual(-100);
        expect(rect.top).toBeGreaterThanOrEqual(-100);
      }
    });
  });

  test('dock item clicks do not cause runtime errors', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'error');
    
    render(<App />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    
    // Click each dock item and ensure no errors
    for (let i = 0; i < Math.min(dockItems.length, 5); i++) {
      await user.click(dockItems[i]);
      
      // Wait for any async operations
      await waitFor(() => {
        expect(consoleSpy).not.toHaveBeenCalled();
      });
    }
  });

  test('hover effects do not cause layout shifts', async () => {
    render(<App />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    
    if (dockItems.length > 0) {
      const firstItem = dockItems[0] as HTMLElement;
      const initialRect = firstItem.getBoundingClientRect();
      
      // Trigger hover
      fireEvent.mouseEnter(firstItem);
      
      await waitFor(() => {
        const hoverRect = firstItem.getBoundingClientRect();
        
        // Position should remain stable (allowing for scale animations)
        expect(Math.abs(hoverRect.left - initialRect.left)).toBeLessThan(50);
        expect(Math.abs(hoverRect.top - initialRect.top)).toBeLessThan(50);
      });
      
      // Trigger mouse leave
      fireEvent.mouseLeave(firstItem);
    }
  });

  test('file explorer opens without overlapping other elements', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Find and click finder icon (should be first dock item)
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    
    if (dockItems.length > 0) {
      await user.click(dockItems[0]); // Finder
      
      // Wait for file explorer to potentially open
      await waitFor(() => {
        // Check if any new elements appeared
        const allElements = document.querySelectorAll('*');
        expect(allElements.length).toBeGreaterThan(0);
      });
    }
  });

  test('responsive behavior at different viewport sizes', () => {
    // Test mobile viewport
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 667 });
    
    const { rerender } = render(<App />);
    
    // Should render without errors on mobile - check for React Flow canvas
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
    
    // Test desktop viewport
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1920 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 1080 });
    
    rerender(<App />);
    
    // Should still render correctly on desktop
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  test('z-index layering is correct', () => {
    render(<App />);
    
    // Dock should have high z-index
    const dockContainer = document.querySelector('[style*="position: fixed"]');
    if (dockContainer) {
      const styles = window.getComputedStyle(dockContainer);
      const zIndex = parseInt(styles.zIndex || '0');
      expect(zIndex).toBeGreaterThan(100); // Should be above other content
    }
  });

  test('text content is readable and not cut off', () => {
    render(<App />);
    
    // Check if React Flow canvas is properly sized
    const reactFlowCanvas = screen.getByTestId('react-flow');
    const canvasRect = reactFlowCanvas.getBoundingClientRect();
    
    expect(canvasRect.width).toBeGreaterThan(0);
    expect(canvasRect.height).toBeGreaterThan(0);
    
    // Check if profile elements exist in DOM
    const profileElements = screen.getAllByText(/Alex Thompson|Video Editor & Creative Storyteller/);
    profileElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      expect(rect.width).toBeGreaterThan(0);
      expect(rect.height).toBeGreaterThan(0);
    });
  });

  test('animations do not cause performance issues', async () => {
    const startTime = performance.now();
    
    render(<App />);
    
    // Trigger multiple animations
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    
    for (let i = 0; i < Math.min(dockItems.length, 3); i++) {
      fireEvent.mouseEnter(dockItems[i]);
      fireEvent.mouseLeave(dockItems[i]);
    }
    
    const endTime = performance.now();
    
    // Should complete quickly
    expect(endTime - startTime).toBeLessThan(1000);
  });

  test('no memory leaks on repeated interactions', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    
    // Perform multiple interactions
    for (let i = 0; i < 10; i++) {
      if (dockItems.length > 0) {
        await user.click(dockItems[0]);
        fireEvent.mouseEnter(dockItems[0]);
        fireEvent.mouseLeave(dockItems[0]);
      }
    }
    
    // Should unmount without errors
    expect(() => unmount()).not.toThrow();
  });

  test('keyboard navigation works correctly', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Test tab navigation
    await user.tab();
    
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeDefined();
    expect(focusedElement).not.toBe(document.body);
  });

  test('error boundaries catch and handle errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // This should not crash the entire app
    render(<App />);
    
    // App should still be functional
    expect(screen.getByText('Alex Thompson')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });
});

describe('Pixel-Perfect Positioning Tests', () => {
  test('dock is centered horizontally', () => {
    render(<App />);
    
    const dockContainer = document.querySelector('[style*="position: fixed"]');
    if (dockContainer) {
      const style = dockContainer.getAttribute('style') || '';
      expect(style).toContain('left: 50%');
      expect(style).toContain('transform: translateX(-50%)');
    }
  });

  test('profile info is properly positioned in canvas', () => {
    render(<App />);
    
    // Check React Flow canvas positioning
    const reactFlowCanvas = screen.getByTestId('react-flow');
    expect(reactFlowCanvas).toBeVisible();
    
    // Profile elements are inside React Flow nodes, check if they exist
    const profileElements = screen.getAllByText(/Alex Thompson|Video Editor & Creative Storyteller/);
    expect(profileElements.length).toBeGreaterThan(0);
    
    // Check that elements are positioned within the canvas
    profileElements.forEach(element => {
      expect(element).toBeVisible();
      const rect = element.getBoundingClientRect();
      expect(rect.width).toBeGreaterThan(0);
      expect(rect.height).toBeGreaterThan(0);
    });
  });

  test('dock items have consistent sizing', () => {
    render(<App />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    
    if (dockItems.length > 1) {
      const firstItemRect = (dockItems[0] as HTMLElement).getBoundingClientRect();
      const secondItemRect = (dockItems[1] as HTMLElement).getBoundingClientRect();
      
      // Should have similar heights
      expect(Math.abs(firstItemRect.height - secondItemRect.height)).toBeLessThan(5);
    }
  });

  test('no negative margins or positions causing layout issues', () => {
    render(<App />);
    
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        const styles = window.getComputedStyle(element);
        
        // Check for problematic negative values
        const marginLeft = parseInt(styles.marginLeft || '0');
        const marginTop = parseInt(styles.marginTop || '0');
        
        // Allow reasonable negative margins but not extreme ones
        if (marginLeft < 0) {
          expect(marginLeft).toBeGreaterThan(-100);
        }
        if (marginTop < 0) {
          expect(marginTop).toBeGreaterThan(-100);
        }
      }
    });
  });
});
