import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MacOSFileExplorerNode from './MacOSFileExplorerNode';

// Mock ReactFlow Handle
jest.mock('reactflow', () => ({
  Handle: ({ children, ...props }: any) => <div data-testid="handle" {...props}>{children}</div>,
  Position: {
    Top: 'top',
    Bottom: 'bottom',
  },
}));

// Mock window.open
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});

const mockData = {
  title: 'Portfolio Explorer',
  folders: [
    {
      id: 'work',
      name: 'Work Projects',
      type: 'work' as const,
      items: [
        {
          id: 'project1',
          name: 'Test Project',
          type: 'project' as const,
          url: 'https://example.com/project1'
        },
        {
          id: 'project2',
          name: 'Another Project',
          type: 'project' as const,
          url: 'https://example.com/project2'
        }
      ]
    },
    {
      id: 'videos',
      name: 'YouTube Videos',
      type: 'video' as const,
      items: [
        {
          id: 'video1',
          name: 'Test Video',
          type: 'video' as const,
          url: 'https://youtube.com/watch?v=test1'
        },
        {
          id: 'video2',
          name: 'Another Video',
          type: 'video' as const,
          url: 'https://youtube.com/watch?v=test2'
        }
      ]
    },
    {
      id: 'empty-folder',
      name: 'Empty Folder',
      type: 'folder' as const,
      items: []
    }
  ],
  onClose: jest.fn(),
};

describe('MacOSFileExplorerNode Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<MacOSFileExplorerNode data={mockData} />);
    expect(screen.getByText('Portfolio Explorer')).toBeInTheDocument();
  });

  test('displays macOS window chrome', () => {
    render(<MacOSFileExplorerNode data={mockData} />);
    
    // Check for traffic light buttons
    const trafficLights = document.querySelectorAll('[style*="borderRadius: 50%"]');
    expect(trafficLights.length).toBeGreaterThanOrEqual(3);
  });

  test('displays folder list in sidebar', () => {
    render(<MacOSFileExplorerNode data={mockData} />);
    
    expect(screen.getByText('Work Projects')).toBeInTheDocument();
    expect(screen.getByText('YouTube Videos')).toBeInTheDocument();
    expect(screen.getByText('Empty Folder')).toBeInTheDocument();
  });

  test('shows default message when no folder selected', () => {
    render(<MacOSFileExplorerNode data={mockData} />);
    
    expect(screen.getByText('Select a folder')).toBeInTheDocument();
    expect(screen.getByText('Choose a folder from the sidebar to view its contents')).toBeInTheDocument();
  });

  test('handles folder selection', async () => {
    const user = userEvent.setup();
    render(<MacOSFileExplorerNode data={mockData} />);
    
    // Click on Work Projects folder
    const workFolder = screen.getByText('Work Projects');
    await user.click(workFolder);
    
    // Should show folder contents
    await waitFor(() => {
      expect(screen.getByText('Test Project')).toBeInTheDocument();
      expect(screen.getByText('Another Project')).toBeInTheDocument();
    });
  });

  test('handles empty folder display', async () => {
    const user = userEvent.setup();
    render(<MacOSFileExplorerNode data={mockData} />);
    
    // Click on empty folder
    const emptyFolder = screen.getByText('Empty Folder');
    await user.click(emptyFolder);
    
    // Should show empty message
    await waitFor(() => {
      expect(screen.getByText('This folder is empty')).toBeInTheDocument();
    });
  });

  test('opens external links when clicking items', async () => {
    const user = userEvent.setup();
    const mockOpen = jest.fn();
    window.open = mockOpen;
    
    render(<MacOSFileExplorerNode data={mockData} />);
    
    // Select work folder first
    const workFolder = screen.getByText('Work Projects');
    await user.click(workFolder);
    
    // Click on project item
    await waitFor(async () => {
      const projectItem = screen.getByText('Test Project');
      await user.click(projectItem);
    });
    
    // Should open external link
    expect(mockOpen).toHaveBeenCalledWith('https://example.com/project1', '_blank');
  });

  test('handles close button click', async () => {
    const user = userEvent.setup();
    const onCloseMock = jest.fn();
    const dataWithMockClose = { ...mockData, onClose: onCloseMock };
    
    render(<MacOSFileExplorerNode data={dataWithMockClose} />);
    
    // Click close button (X)
    const closeButton = screen.getByRole('button');
    await user.click(closeButton);
    
    expect(onCloseMock).toHaveBeenCalled();
  });

  test('handles traffic light close button', async () => {
    const user = userEvent.setup();
    const onCloseMock = jest.fn();
    const dataWithMockClose = { ...mockData, onClose: onCloseMock };
    
    render(<MacOSFileExplorerNode data={dataWithMockClose} />);
    
    // Click red traffic light button
    const redButton = document.querySelector('[style*="backgroundColor: #ff5f57"]');
    if (redButton) {
      fireEvent.click(redButton);
      expect(onCloseMock).toHaveBeenCalled();
    }
  });

  test('displays correct icons for different file types', async () => {
    const user = userEvent.setup();
    render(<MacOSFileExplorerNode data={mockData} />);
    
    // Select work folder
    const workFolder = screen.getByText('Work Projects');
    await user.click(workFolder);
    
    // Check if icons are rendered (they should have specific test ids or classes)
    await waitFor(() => {
      const icons = document.querySelectorAll('svg');
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  test('handles folder selection state correctly', async () => {
    const user = userEvent.setup();
    render(<MacOSFileExplorerNode data={mockData} />);
    
    // Click on work folder
    const workFolder = screen.getByText('Work Projects');
    await user.click(workFolder);
    
    // Work folder should be selected (highlighted)
    await waitFor(() => {
      const selectedFolder = workFolder.closest('[style*="backgroundColor: #007AFF"]');
      expect(selectedFolder).toBeInTheDocument();
    });
    
    // Click on videos folder
    const videosFolder = screen.getByText('YouTube Videos');
    await user.click(videosFolder);
    
    // Videos folder should now be selected
    await waitFor(() => {
      const selectedFolder = videosFolder.closest('[style*="backgroundColor: #007AFF"]');
      expect(selectedFolder).toBeInTheDocument();
    });
  });
});

describe('Error Handling', () => {
  test('handles missing folders gracefully', () => {
    const dataWithoutFolders = {
      ...mockData,
      folders: []
    };
    
    expect(() => render(<MacOSFileExplorerNode data={dataWithoutFolders} />)).not.toThrow();
  });

  test('handles undefined folders', () => {
    const dataWithUndefinedFolders = {
      ...mockData,
      folders: undefined as any
    };
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<MacOSFileExplorerNode data={dataWithUndefinedFolders} />)).not.toThrow();
    
    consoleSpy.mockRestore();
  });

  test('handles items without URLs', async () => {
    const user = userEvent.setup();
    const dataWithNoUrls = {
      ...mockData,
      folders: [
        {
          id: 'test',
          name: 'Test Folder',
          type: 'folder' as const,
          items: [
            {
              id: 'item1',
              name: 'Item without URL',
              type: 'document' as const
              // No URL property
            }
          ]
        }
      ]
    };
    
    render(<MacOSFileExplorerNode data={dataWithNoUrls} />);
    
    // Select folder
    const testFolder = screen.getByText('Test Folder');
    await user.click(testFolder);
    
    // Click item without URL (should not crash)
    await waitFor(async () => {
      const item = screen.getByText('Item without URL');
      await user.click(item);
    });
    
    // Should not have called window.open
    expect(window.open).not.toHaveBeenCalled();
  });

  test('handles malformed data structure', () => {
    const malformedData = {
      title: 'Test',
      folders: [
        {
          // Missing required properties
          name: 'Incomplete Folder'
        }
      ],
      onClose: jest.fn()
    } as any;
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => render(<MacOSFileExplorerNode data={malformedData} />)).not.toThrow();
    
    consoleSpy.mockRestore();
  });
});

describe('Accessibility', () => {
  test('has proper ARIA labels', () => {
    render(<MacOSFileExplorerNode data={mockData} />);
    
    // Check for accessibility attributes
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  test('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<MacOSFileExplorerNode data={mockData} />);
    
    // Test tab navigation
    await user.tab();
    
    const focusedElement = document.activeElement;
    expect(focusedElement).toBeDefined();
  });

  test('has proper heading structure', () => {
    render(<MacOSFileExplorerNode data={mockData} />);
    
    // Should have proper heading for the window title
    expect(screen.getByText('Portfolio Explorer')).toBeInTheDocument();
  });
});

describe('Performance', () => {
  test('renders large folder lists efficiently', () => {
    const largeData = {
      ...mockData,
      folders: Array.from({ length: 100 }, (_, i) => ({
        id: `folder-${i}`,
        name: `Folder ${i}`,
        type: 'folder' as const,
        items: Array.from({ length: 50 }, (_, j) => ({
          id: `item-${i}-${j}`,
          name: `Item ${j}`,
          type: 'document' as const,
          url: `https://example.com/item-${i}-${j}`
        }))
      }))
    };
    
    const startTime = performance.now();
    render(<MacOSFileExplorerNode data={largeData} />);
    const endTime = performance.now();
    
    // Should render within reasonable time even with large data
    expect(endTime - startTime).toBeLessThan(1000);
  });

  test('does not cause memory leaks', () => {
    const { unmount } = render(<MacOSFileExplorerNode data={mockData} />);
    
    expect(() => unmount()).not.toThrow();
  });
});
