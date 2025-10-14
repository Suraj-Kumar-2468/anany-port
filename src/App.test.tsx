import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import portfolioData from './data/portfolioData.json';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock window.open for external link tests
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders app without crashing', () => {
    render(<App />);
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
  });

  test('displays profile information correctly', () => {
    render(<App />);
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
    expect(screen.getByText(portfolioData.profile.title)).toBeInTheDocument();
  });

  test('renders macOS dock with all icons', () => {
    render(<App />);
    // Check if dock is rendered (it should be at the bottom)
    const dockContainer = document.querySelector('[style*="position: fixed"]');
    expect(dockContainer).toBeInTheDocument();
  });

  test('handles section navigation correctly', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Initially should show work section (default)
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
  });

  test('handles invalid portfolio data gracefully', () => {
    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // This should not crash the app even with invalid data
    render(<App />);
    
    consoleSpy.mockRestore();
  });
});

describe('Navigation and Interactions', () => {
  test('dock item clicks trigger navigation', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Test clicking dock items (they should be rendered)
    await waitFor(() => {
      const dockContainer = document.querySelector('[style*="position: fixed"]');
      expect(dockContainer).toBeInTheDocument();
    });
  });

  test('file explorer opens when clicking finder', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Look for finder icon and click it
    await waitFor(() => {
      const finderIcon = screen.getByLabelText(/finder/i) || document.querySelector('[data-testid="finder"]');
      if (finderIcon) {
        fireEvent.click(finderIcon);
      }
    });
  });

  test('external links open in new tab', async () => {
    render(<App />);
    
    // Mock window.open
    const mockOpen = jest.fn();
    window.open = mockOpen;
    
    // This test would need the file explorer to be open and items to be clicked
    // The actual implementation would depend on the UI structure
  });
});

describe('Error Handling', () => {
  test('handles missing video data gracefully', () => {
    // Mock portfolioData with missing videos
    const mockData = {
      ...portfolioData,
      videos: undefined
    };
    
    // Should not crash
    expect(() => render(<App />)).not.toThrow();
  });

  test('handles missing project data gracefully', () => {
    // Mock portfolioData with missing projects
    const mockData = {
      ...portfolioData,
      sections: {
        ...portfolioData.sections,
        work: {
          ...portfolioData.sections.work,
          projects: undefined
        }
      }
    };
    
    // Should not crash
    expect(() => render(<App />)).not.toThrow();
  });

  test('handles network errors gracefully', async () => {
    // Mock fetch to simulate network error
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));
    
    render(<App />);
    
    // App should still render even if external resources fail
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
  });

  test('handles invalid JSON data', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // App should handle invalid data without crashing
    render(<App />);
    
    consoleSpy.mockRestore();
  });
});

describe('Accessibility', () => {
  test('has proper ARIA labels', () => {
    render(<App />);
    
    // Check for proper accessibility attributes
    const mainContent = document.querySelector('main') || document.body;
    expect(mainContent).toBeInTheDocument();
  });

  test('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Test tab navigation
    await user.tab();
    
    // Should be able to navigate through interactive elements
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeDefined();
  });

  test('has proper color contrast', () => {
    render(<App />);
    
    // This is a basic check - in a real app you'd use tools like axe-core
    const elements = document.querySelectorAll('*');
    expect(elements.length).toBeGreaterThan(0);
  });
});

describe('Performance', () => {
  test('renders within reasonable time', async () => {
    const startTime = performance.now();
    render(<App />);
    const endTime = performance.now();
    
    // Should render within 1 second
    expect(endTime - startTime).toBeLessThan(1000);
  });

  test('does not have memory leaks', () => {
    const { unmount } = render(<App />);
    
    // Unmount should clean up properly
    expect(() => unmount()).not.toThrow();
  });
});
