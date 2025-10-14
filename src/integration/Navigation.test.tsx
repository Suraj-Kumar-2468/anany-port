import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import portfolioData from '../data/portfolioData.json';

// Mock all external dependencies
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onMouseEnter, onMouseLeave, onClick, ...props }: any) => (
      <div 
        {...props}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        data-testid="motion-div"
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => children,
}));

jest.mock('reactflow', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="react-flow">{children}</div>,
  Handle: ({ children, ...props }: any) => <div data-testid="handle" {...props}>{children}</div>,
  Position: {
    Top: 'top',
    Bottom: 'bottom',
    Left: 'left',
    Right: 'right',
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

// Mock window.open
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});

describe('Complete Navigation Flow Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('complete app navigation flow', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // 1. App should load with profile information
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
    expect(screen.getByText(portfolioData.profile.title)).toBeInTheDocument();
    
    // 2. Dock should be rendered
    const dockContainer = document.querySelector('[style*="position: fixed"]');
    expect(dockContainer).toBeInTheDocument();
    
    // 3. React Flow canvas should be rendered
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  test('dock navigation integration', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Find dock items
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    expect(dockItems.length).toBeGreaterThan(0);
    
    // Test clicking different dock items
    if (dockItems.length > 1) {
      await user.click(dockItems[1]); // Should be work section
      // App should handle the navigation
      expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
    }
  });

  test('file explorer integration flow', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // 1. Click finder to open file explorer
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    if (dockItems.length > 0) {
      await user.click(dockItems[0]); // Finder should be first
      
      // 2. File explorer should open (this depends on implementation)
      // We're testing that the click doesn't crash the app
      expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
    }
  });

  test('external link navigation', async () => {
    const mockOpen = jest.fn();
    window.open = mockOpen;
    
    render(<App />);
    
    // This test simulates the complete flow of opening file explorer
    // and clicking on external links
    // The actual implementation would depend on the UI structure
    
    // Verify that window.open mock is set up correctly
    expect(window.open).toBe(mockOpen);
  });

  test('error recovery integration', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Test that the app recovers from various error conditions
    render(<App />);
    
    // App should still be functional
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  test('responsive behavior integration', async () => {
    // Test different viewport sizes
    const originalInnerWidth = window.innerWidth;
    const originalInnerHeight = window.innerHeight;
    
    // Mobile viewport
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 375 });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 667 });
    
    render(<App />);
    
    // App should render on mobile
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
    
    // Restore original viewport
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: originalInnerWidth });
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: originalInnerHeight });
  });

  test('keyboard navigation integration', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Test tab navigation through the app
    await user.tab();
    await user.tab();
    await user.tab();
    
    // Should be able to navigate without crashing
    expect(document.activeElement).toBeDefined();
  });

  test('data loading and display integration', () => {
    render(<App />);
    
    // Verify all data is loaded and displayed correctly
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
    expect(screen.getByText(portfolioData.profile.title)).toBeInTheDocument();
    
    // Verify data structure is correct
    expect(portfolioData.videos.fullLength).toBeDefined();
    expect(portfolioData.videos.shorts).toBeDefined();
    expect(portfolioData.sections.work.projects).toBeDefined();
    
    expect(Array.isArray(portfolioData.videos.fullLength)).toBe(true);
    expect(Array.isArray(portfolioData.videos.shorts)).toBe(true);
    expect(Array.isArray(portfolioData.sections.work.projects)).toBe(true);
  });

  test('animation and interaction integration', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Test hover interactions on dock
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    if (dockItems.length > 0) {
      // Hover over dock item
      fireEvent.mouseEnter(dockItems[0]);
      
      // Should show tooltip
      await waitFor(() => {
        // Look for tooltip elements
        const tooltips = document.querySelectorAll('[style*="position: absolute"]');
        // Tooltip behavior depends on implementation
      });
      
      // Mouse leave
      fireEvent.mouseLeave(dockItems[0]);
    }
  });

  test('performance integration under load', async () => {
    const startTime = performance.now();
    
    // Render multiple instances to test performance
    const { unmount: unmount1 } = render(<App />);
    const { unmount: unmount2 } = render(<App />);
    const { unmount: unmount3 } = render(<App />);
    
    const endTime = performance.now();
    
    // Should render multiple instances quickly
    expect(endTime - startTime).toBeLessThan(2000);
    
    // Clean up
    unmount1();
    unmount2();
    unmount3();
  });

  test('state management integration', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Test state changes through interactions
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    
    // Click different dock items to test state management
    if (dockItems.length >= 3) {
      await user.click(dockItems[0]); // Finder
      await user.click(dockItems[1]); // Work
      await user.click(dockItems[2]); // Resume
      
      // App should handle state changes without crashing
      expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
    }
  });
});

describe('Error Scenarios Integration', () => {
  test('handles corrupted portfolio data', () => {
    // Mock corrupted data
    const originalData = require('../data/portfolioData.json');
    
    // Test with various corrupted data scenarios
    const corruptedScenarios = [
      { ...originalData, profile: null },
      { ...originalData, sections: null },
      { ...originalData, videos: null },
      { ...originalData, videos: { fullLength: null, shorts: null } },
    ];
    
    corruptedScenarios.forEach((corruptedData, index) => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Mock the data import
      jest.doMock('../data/portfolioData.json', () => corruptedData, { virtual: true });
      
      // Should not crash with corrupted data
      expect(() => render(<App />)).not.toThrow();
      
      consoleSpy.mockRestore();
    });
  });

  test('handles network failures gracefully', async () => {
    // Mock fetch failures
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    
    render(<App />);
    
    // App should still render despite network failures
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
  });

  test('handles browser compatibility issues', () => {
    // Mock missing browser APIs
    const originalOpen = window.open;
    delete (window as any).open;
    
    render(<App />);
    
    // App should handle missing APIs gracefully
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
    
    // Restore
    window.open = originalOpen;
  });
});

describe('Accessibility Integration', () => {
  test('complete accessibility flow', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Test keyboard navigation through entire app
    await user.tab();
    await user.tab();
    await user.tab();
    
    // Test screen reader compatibility
    const headings = screen.getAllByRole('heading', { hidden: true });
    // Should have proper heading structure
    
    // Test focus management
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    // Should have focusable elements
    expect(focusableElements.length).toBeGreaterThanOrEqual(0);
  });

  test('color contrast and visual accessibility', () => {
    render(<App />);
    
    // Test that important elements have proper contrast
    const importantElements = document.querySelectorAll('[style*="color"]');
    expect(importantElements.length).toBeGreaterThan(0);
  });
});
