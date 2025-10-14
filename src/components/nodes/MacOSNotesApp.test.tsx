import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MacOSNotesApp from './MacOSNotesApp';

describe('MacOSNotesApp Component', () => {
  const mockOnClose = jest.fn();
  
  const mockData = {
    title: 'Test Note',
    content: 'This is a test note content\nWith multiple lines\nAnd some details',
    type: 'about' as const,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<MacOSNotesApp data={mockData} />);
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  test('displays note content correctly', () => {
    render(<MacOSNotesApp data={mockData} />);
    
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText(/This is a test note content/)).toBeInTheDocument();
  });

  test('shows macOS window chrome with traffic lights', () => {
    render(<MacOSNotesApp data={mockData} />);
    
    // Check for traffic light buttons (they should be rendered as colored circles)
    const trafficLights = document.querySelectorAll('[style*="borderRadius: 50%"]');
    expect(trafficLights.length).toBeGreaterThanOrEqual(3);
  });

  test('close button works correctly', () => {
    render(<MacOSNotesApp data={mockData} />);
    
    // Find and click the red traffic light (close button)
    const redButton = document.querySelector('[style*="backgroundColor: #ff5f57"]');
    expect(redButton).toBeInTheDocument();
    
    fireEvent.click(redButton!);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('displays current date', () => {
    render(<MacOSNotesApp data={mockData} />);
    
    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    
    expect(screen.getByText(today)).toBeInTheDocument();
  });

  test('shows character and line count', () => {
    render(<MacOSNotesApp data={mockData} />);
    
    const lines = mockData.content.split('\n').length;
    const chars = mockData.content.length;
    
    expect(screen.getByText(`${lines} lines, ${chars} characters`)).toBeInTheDocument();
  });

  test('handles maximize functionality', () => {
    render(<MacOSNotesApp data={mockData} />);
    
    // Find and click the green traffic light (maximize button)
    const greenButton = document.querySelector('[style*="backgroundColor: #28ca42"]');
    expect(greenButton).toBeInTheDocument();
    
    fireEvent.click(greenButton!);
    // The component should still be rendered (maximize just changes size)
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  test('preserves line breaks in content', () => {
    const multiLineData = {
      ...mockData,
      content: 'Line 1\nLine 2\nLine 3'
    };
    
    render(<MacOSNotesApp data={multiLineData} />);
    
    // The content should preserve line breaks
    const contentElement = screen.getByText(/Line 1/);
    expect(contentElement).toBeInTheDocument();
  });

  test('handles different note types', () => {
    const projectData = {
      ...mockData,
      type: 'project' as const,
      title: 'Project Details'
    };
    
    render(<MacOSNotesApp data={projectData} />);
    expect(screen.getByText('Project Details')).toBeInTheDocument();
  });

  test('applies correct styling for macOS appearance', () => {
    render(<MacOSNotesApp data={mockData} />);
    
    // Check for macOS-style window
    const windowElement = document.querySelector('[style*="borderRadius"]');
    expect(windowElement).toBeInTheDocument();
    
    // Check for proper font family
    const contentArea = document.querySelector('[style*="fontFamily"]');
    expect(contentArea).toBeInTheDocument();
  });
});
