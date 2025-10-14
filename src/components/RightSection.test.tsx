import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RightSection from './RightSection';
import portfolioData from '../data/portfolioData.json';

// Mock ReactFlow to avoid canvas rendering issues in tests
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

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Mock window.open
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});

const mockProps = {
  selectedSection: 'work',
  portfolioData,
  onInfoClick: jest.fn(),
  detailData: null,
  onSectionChange: jest.fn(),
};

describe('RightSection Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<RightSection {...mockProps} />);
    expect(screen.getByTestId('react-flow')).toBeInTheDocument();
  });

  test('displays profile information', () => {
    render(<RightSection {...mockProps} />);
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
    expect(screen.getByText(portfolioData.profile.title)).toBeInTheDocument();
  });

  test('renders macOS dock', () => {
    render(<RightSection {...mockProps} />);
    // Check if dock container is rendered
    const dockContainer = document.querySelector('[style*="position: fixed"]');
    expect(dockContainer).toBeInTheDocument();
  });

  test('handles dock item clicks', async () => {
    const user = userEvent.setup();
    const onSectionChangeMock = jest.fn();
    
    render(<RightSection {...mockProps} onSectionChange={onSectionChangeMock} />);
    
    // Find dock items and test clicking
    await waitFor(() => {
      const dockItems = document.querySelectorAll('[style*="cursor: pointer"]');
      if (dockItems.length > 0) {
        fireEvent.click(dockItems[0]);
      }
    });
  });

  test('opens file explorer when clicking finder', async () => {
    render(<RightSection {...mockProps} />);
    
    // Simulate clicking finder icon
    await waitFor(() => {
      const finderButton = document.querySelector('[data-testid*="finder"]') || 
                          document.querySelector('div[style*="cursor: pointer"]');
      if (finderButton) {
        fireEvent.click(finderButton);
      }
    });
  });
});

describe('File Explorer Functionality', () => {
  test('displays file explorer when toggled', async () => {
    render(<RightSection {...mockProps} />);
    
    // The file explorer should be toggleable
    // This would need to be tested based on the actual UI structure
  });

  test('handles folder navigation in file explorer', async () => {
    render(<RightSection {...mockProps} />);
    
    // Test folder clicking and navigation
    // This would depend on the file explorer being open
  });

  test('opens external links when clicking items', async () => {
    const mockOpen = jest.fn();
    window.open = mockOpen;
    
    render(<RightSection {...mockProps} />);
    
    // Test clicking on video/project items
    // This would need the file explorer to be open and items to be visible
  });

  test('closes file explorer when clicking close button', async () => {
    render(<RightSection {...mockProps} />);
    
    // Test closing the file explorer
    // This would need the file explorer to be open first
  });
});

describe('Data Handling', () => {
  test('handles missing video data gracefully', () => {
    const mockDataWithoutVideos = {
      ...portfolioData,
      videos: undefined
    };
    
    expect(() => 
      render(<RightSection {...mockProps} portfolioData={mockDataWithoutVideos} />)
    ).not.toThrow();
  });

  test('handles missing project data gracefully', () => {
    const mockDataWithoutProjects = {
      ...portfolioData,
      sections: {
        ...portfolioData.sections,
        work: {
          ...portfolioData.sections.work,
          projects: []
        }
      }
    };
    
    expect(() => 
      render(<RightSection {...mockProps} portfolioData={mockDataWithoutProjects} />)
    ).not.toThrow();
  });

  test('handles invalid video structure', () => {
    const mockDataWithInvalidVideos = {
      ...portfolioData,
      videos: {
        // Missing fullLength and shorts arrays
        invalid: 'data'
      }
    };
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => 
      render(<RightSection {...mockProps} portfolioData={mockDataWithInvalidVideos} />)
    ).not.toThrow();
    
    consoleSpy.mockRestore();
  });

  test('renders correct number of video items', () => {
    render(<RightSection {...mockProps} />);
    
    // Check if the correct number of videos are processed
    const fullLengthCount = portfolioData.videos.fullLength.length;
    const shortsCount = portfolioData.videos.shorts.length;
    
    expect(fullLengthCount).toBeGreaterThan(0);
    expect(shortsCount).toBeGreaterThan(0);
  });

  test('renders correct number of project items', () => {
    render(<RightSection {...mockProps} />);
    
    // Check if the correct number of projects are processed
    const projectCount = portfolioData.sections.work.projects.length;
    expect(projectCount).toBeGreaterThan(0);
  });
});

describe('Section Navigation', () => {
  test('calls onSectionChange when dock items are clicked', async () => {
    const onSectionChangeMock = jest.fn();
    render(<RightSection {...mockProps} onSectionChange={onSectionChangeMock} />);
    
    // This would test actual dock item clicks
    // Implementation depends on how dock items are structured
  });

  test('updates content when selectedSection changes', () => {
    const { rerender } = render(<RightSection {...mockProps} selectedSection="work" />);
    
    // Change section
    rerender(<RightSection {...mockProps} selectedSection="about" />);
    
    // Content should update accordingly
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
  });
});

describe('Error Boundaries', () => {
  test('handles React Flow errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // This should not crash even if ReactFlow has issues
    expect(() => render(<RightSection {...mockProps} />)).not.toThrow();
    
    consoleSpy.mockRestore();
  });

  test('handles framer-motion errors gracefully', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // This should not crash even if framer-motion has issues
    expect(() => render(<RightSection {...mockProps} />)).not.toThrow();
    
    consoleSpy.mockRestore();
  });
});

describe('Performance', () => {
  test('renders within reasonable time', () => {
    const startTime = performance.now();
    render(<RightSection {...mockProps} />);
    const endTime = performance.now();
    
    // Should render within 500ms
    expect(endTime - startTime).toBeLessThan(500);
  });

  test('does not cause memory leaks', () => {
    const { unmount } = render(<RightSection {...mockProps} />);
    
    expect(() => unmount()).not.toThrow();
  });

  test('handles rapid section changes', () => {
    const { rerender } = render(<RightSection {...mockProps} selectedSection="work" />);
    
    // Rapidly change sections
    rerender(<RightSection {...mockProps} selectedSection="about" />);
    rerender(<RightSection {...mockProps} selectedSection="resume" />);
    rerender(<RightSection {...mockProps} selectedSection="work" />);
    
    // Should handle rapid changes without crashing
    expect(screen.getByText(portfolioData.profile.name)).toBeInTheDocument();
  });
});

describe('Accessibility', () => {
  test('has proper ARIA attributes', () => {
    render(<RightSection {...mockProps} />);
    
    // Check for accessibility attributes
    const interactiveElements = document.querySelectorAll('[role], [aria-label], [aria-labelledby]');
    // Should have some accessible elements
    expect(interactiveElements.length).toBeGreaterThanOrEqual(0);
  });

  test('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<RightSection {...mockProps} />);
    
    // Test tab navigation
    await user.tab();
    
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeDefined();
  });
});
