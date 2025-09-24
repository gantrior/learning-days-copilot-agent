import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../components/Loading';

describe('Loading Component', () => {
  test('should render with default loading message', () => {
    render(<Loading />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('🐱')).toBeInTheDocument();
  });

  test('should render with custom message', () => {
    const customMessage = 'Fetching cat products...';
    render(<Loading message={customMessage} />);
    
    expect(screen.getByText(customMessage)).toBeInTheDocument();
    expect(screen.getByText('🐱')).toBeInTheDocument();
  });

  test('should apply correct CSS classes', () => {
    render(<Loading />);
    
    const container = screen.getByText('Loading...').closest('.loading-container');
    expect(container).toHaveClass('loading-container');
    
    const spinner = screen.getByText('🐱').closest('.cat-spinner');
    expect(spinner).toHaveClass('cat-spinner');
    
    const message = screen.getByText('Loading...');
    expect(message).toHaveClass('loading-message');
  });

  test('should handle empty message', () => {
    render(<Loading message="" />);
    
    const messageElement = document.querySelector('.loading-message');
    expect(messageElement).toBeInTheDocument();
    expect(messageElement).toHaveClass('loading-message');
    expect(messageElement.textContent).toBe('');
  });

  test('should handle long custom messages', () => {
    const longMessage = 'This is a very long loading message that might wrap to multiple lines in the UI';
    render(<Loading message={longMessage} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  test('should always display cat emoji spinner', () => {
    render(<Loading message="Custom message" />);
    
    const catSpinner = screen.getByText('🐱');
    expect(catSpinner).toBeInTheDocument();
    expect(catSpinner.closest('.cat-spinner')).toBeInTheDocument();
  });
});