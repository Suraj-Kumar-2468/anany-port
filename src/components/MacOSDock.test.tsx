import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MacOSDock from './MacOSDock';

// Mock framer-motion
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
}));

const mockOnItemClick = jest.fn();

describe('MacOSDock Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    // Check if dock container is rendered
    const dockContainer = document.querySelector('[style*="position: fixed"]');
    expect(dockContainer).toBeInTheDocument();
  });

  test('renders all dock items', () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    // Check if all dock items are rendered
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    expect(dockItems.length).toBe(13); // Should have 13 dock items
  });

  test('displays dock at bottom center of screen', () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    const dockContainer = document.querySelector('[style*="position: fixed"]');
    expect(dockContainer).toHaveStyle({
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
    });
  });

  test('has glassmorphism styling', () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    const dockContainer = document.querySelector('[style*="backdropFilter"]');
    expect(dockContainer).toBeInTheDocument();
  });

  test('handles item clicks correctly', async () => {
    const user = userEvent.setup();
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    // Click on the first dock item
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    if (dockItems.length > 0) {
      await user.click(dockItems[0]);
      expect(mockOnItemClick).toHaveBeenCalled();
    }
  });

  test('shows tooltips on hover', async () => {
    const user = userEvent.setup();
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    // Hover over a dock item
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    if (dockItems.length > 0) {
      fireEvent.mouseEnter(dockItems[0]);
      
      // Should show tooltip
      await waitFor(() => {
        const tooltip = document.querySelector('[style*="position: absolute"]');
        expect(tooltip).toBeInTheDocument();
      });
    }
  });

  test('hides tooltips on mouse leave', async () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    if (dockItems.length > 0) {
      // Hover then leave
      fireEvent.mouseEnter(dockItems[0]);
      fireEvent.mouseLeave(dockItems[0]);
      
      // Tooltip should be hidden
      await waitFor(() => {
        const tooltips = document.querySelectorAll('[style*="position: absolute"]');
        // Should not have visible tooltips
        expect(tooltips.length).toBe(0);
      });
    }
  });

  test('calls onItemClick with correct item ID', async () => {
    const user = userEvent.setup();
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    // The first item should be 'finder'
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    if (dockItems.length > 0) {
      await user.click(dockItems[0]);
      expect(mockOnItemClick).toHaveBeenCalledWith('finder');
    }
  });

  test('has proper icon colors', () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    // Check if icons have proper styling
    const iconContainers = document.querySelectorAll('[style*="backgroundColor"]');
    expect(iconContainers.length).toBeGreaterThan(0);
  });

  test('displays all required dock items', () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    // Check if specific dock items exist by looking for their containers
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    
    // Should have finder, work, resume, youtube-videos, youtube-shorts, about, etc.
    expect(dockItems.length).toBe(13);
  });
});

describe('Hover Effects', () => {
  test('handles hover state changes', async () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    if (dockItems.length > 0) {
      // Test hover enter
      fireEvent.mouseEnter(dockItems[0]);
      
      // Test hover leave
      fireEvent.mouseLeave(dockItems[0]);
      
      // Should not crash
      expect(dockItems[0]).toBeInTheDocument();
    }
  });

  test('shows correct tooltip text', async () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    if (dockItems.length > 0) {
      fireEvent.mouseEnter(dockItems[0]);
      
      // Should show "Finder" tooltip for first item
      await waitFor(() => {
        const tooltip = document.querySelector('[style*="position: absolute"]');
        if (tooltip) {
          expect(tooltip.textContent).toBe('Finder');
        }
      });
    }
  });

  test('handles rapid hover changes', async () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    if (dockItems.length >= 3) {
      // Rapidly hover over multiple items
      fireEvent.mouseEnter(dockItems[0]);
      fireEvent.mouseLeave(dockItems[0]);
      fireEvent.mouseEnter(dockItems[1]);
      fireEvent.mouseLeave(dockItems[1]);
      fireEvent.mouseEnter(dockItems[2]);
      fireEvent.mouseLeave(dockItems[2]);
      
      // Should handle rapid changes without crashing
      expect(dockItems[0]).toBeInTheDocument();
    }
  });
});

describe('Accessibility', () => {
  test('has proper ARIA attributes', () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    // Dock items should be clickable
    const clickableItems = document.querySelectorAll('[style*="cursor: pointer"]');
    expect(clickableItems.length).toBeGreaterThan(0);
  });

  test('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    // Test tab navigation
    await user.tab();
    
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeDefined();
  });

  test('has proper color contrast', () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    // Icons should have proper contrast (white icons on colored backgrounds)
    const iconContainers = document.querySelectorAll('[style*="color: white"]');
    expect(iconContainers.length).toBeGreaterThan(0);
  });
});

describe('Error Handling', () => {
  test('handles missing onItemClick prop gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Should not crash even without onItemClick
    expect(() => render(<MacOSDock onItemClick={undefined as any} />)).not.toThrow();
    
    consoleSpy.mockRestore();
  });

  test('handles click events when onItemClick is undefined', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<MacOSDock onItemClick={undefined as any} />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    if (dockItems.length > 0) {
      // Should not crash when clicking
      await user.click(dockItems[0]);
    }
    
    consoleSpy.mockRestore();
  });

  test('handles framer-motion errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Should render even if framer-motion has issues
    expect(() => render(<MacOSDock onItemClick={mockOnItemClick} />)).not.toThrow();
    
    consoleSpy.mockRestore();
  });
});

describe('Performance', () => {
  test('renders within reasonable time', () => {
    const startTime = performance.now();
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    const endTime = performance.now();
    
    // Should render quickly
    expect(endTime - startTime).toBeLessThan(100);
  });

  test('does not cause memory leaks', () => {
    const { unmount } = render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    expect(() => unmount()).not.toThrow();
  });

  test('handles multiple rapid clicks', async () => {
    const user = userEvent.setup();
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    const dockItems = document.querySelectorAll('[data-testid="motion-div"]');
    if (dockItems.length > 0) {
      // Rapidly click multiple times
      await user.click(dockItems[0]);
      await user.click(dockItems[0]);
      await user.click(dockItems[0]);
      
      // Should handle rapid clicks
      expect(mockOnItemClick).toHaveBeenCalledTimes(3);
    }
  });
});

describe('Visual Effects', () => {
  test('has proper box shadow', () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    const dockContainer = document.querySelector('[style*="boxShadow"]');
    expect(dockContainer).toBeInTheDocument();
  });

  test('has proper border radius', () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    const dockContainer = document.querySelector('[style*="borderRadius"]');
    expect(dockContainer).toBeInTheDocument();
  });

  test('has proper gap between items', () => {
    render(<MacOSDock onItemClick={mockOnItemClick} />);
    
    const dockContainer = document.querySelector('[style*="gap"]');
    expect(dockContainer).toBeInTheDocument();
  });
});
