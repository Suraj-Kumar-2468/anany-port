import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MacOSNotesApp from './MacOSNotesApp';

// Mock window.open
const mockWindowOpen = jest.fn();
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
});

describe('MacOSNotesApp - Clickable Links', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders links as clickable elements', () => {
    const contentWithLink = 'Check out this video: https://youtube.com/watch?v=example\nAnd this website: https://example.com';
    
    const mockData = {
      title: 'Test Note with Links',
      content: contentWithLink,
      type: 'project' as const,
      onClose: mockOnClose,
    };

    render(<MacOSNotesApp data={mockData} />);
    
    // Check if links are rendered as clickable elements
    const youtubeLink = screen.getByText('https://youtube.com/watch?v=example');
    const websiteLink = screen.getByText('https://example.com');
    
    expect(youtubeLink).toBeInTheDocument();
    expect(websiteLink).toBeInTheDocument();
    
    // Check if they have the correct href attributes
    expect(youtubeLink.closest('a')).toHaveAttribute('href', 'https://youtube.com/watch?v=example');
    expect(websiteLink.closest('a')).toHaveAttribute('href', 'https://example.com');
  });

  test('opens links in new tab when clicked', () => {
    const contentWithLink = 'Video link: https://youtube.com/watch?v=test123';
    
    const mockData = {
      title: 'Test Note',
      content: contentWithLink,
      type: 'project' as const,
      onClose: mockOnClose,
    };

    render(<MacOSNotesApp data={mockData} />);
    
    const link = screen.getByText('https://youtube.com/watch?v=test123');
    
    // Click the link
    fireEvent.click(link);
    
    // Verify window.open was called with correct parameters
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://youtube.com/watch?v=test123',
      '_blank',
      'noopener,noreferrer'
    );
  });

  test('handles multiple links in content', () => {
    const contentWithMultipleLinks = `
    Project Links:
    🔗 YouTube: https://youtube.com/watch?v=project1
    🔗 GitHub: https://github.com/user/project
    🔗 Demo: https://demo.example.com
    
    Additional resources:
    📺 Tutorial: https://youtube.com/watch?v=tutorial
    `;
    
    const mockData = {
      title: 'Multiple Links Test',
      content: contentWithMultipleLinks,
      type: 'project' as const,
      onClose: mockOnClose,
    };

    render(<MacOSNotesApp data={mockData} />);
    
    // Check all links are rendered
    expect(screen.getByText('https://youtube.com/watch?v=project1')).toBeInTheDocument();
    expect(screen.getByText('https://github.com/user/project')).toBeInTheDocument();
    expect(screen.getByText('https://demo.example.com')).toBeInTheDocument();
    expect(screen.getByText('https://youtube.com/watch?v=tutorial')).toBeInTheDocument();
  });

  test('preserves text formatting around links', () => {
    const contentWithFormattedLinks = `
    📁 Project Name
    
    📝 Description:
    This is a great project. Check it out: https://example.com
    
    🔗 Links:
    • Main site: https://main.example.com
    • Documentation: https://docs.example.com
    `;
    
    const mockData = {
      title: 'Formatted Content Test',
      content: contentWithFormattedLinks,
      type: 'project' as const,
      onClose: mockOnClose,
    };

    render(<MacOSNotesApp data={mockData} />);
    
    // Check that text content is preserved
    expect(screen.getByText(/📁 Project Name/)).toBeInTheDocument();
    expect(screen.getByText(/📝 Description:/)).toBeInTheDocument();
    expect(screen.getByText(/🔗 Links:/)).toBeInTheDocument();
    
    // Check that links are clickable
    expect(screen.getByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('https://main.example.com')).toBeInTheDocument();
    expect(screen.getByText('https://docs.example.com')).toBeInTheDocument();
  });

  test('handles content without links normally', () => {
    const contentWithoutLinks = `
    📁 Project Without Links
    
    📝 Description:
    This project has no external links.
    Just regular text content.
    `;
    
    const mockData = {
      title: 'No Links Test',
      content: contentWithoutLinks,
      type: 'project' as const,
      onClose: mockOnClose,
    };

    render(<MacOSNotesApp data={mockData} />);
    
    // Check that content is rendered normally
    expect(screen.getByText(/📁 Project Without Links/)).toBeInTheDocument();
    expect(screen.getByText(/This project has no external links/)).toBeInTheDocument();
    
    // Verify no links are present
    const links = screen.queryAllByRole('link');
    expect(links).toHaveLength(0);
  });

  test('link styling is applied correctly', () => {
    const contentWithLink = 'Visit: https://example.com';
    
    const mockData = {
      title: 'Styling Test',
      content: contentWithLink,
      type: 'project' as const,
      onClose: mockOnClose,
    };

    render(<MacOSNotesApp data={mockData} />);
    
    const link = screen.getByText('https://example.com');
    const linkElement = link.closest('a');
    
    // Check if link has proper attributes
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
