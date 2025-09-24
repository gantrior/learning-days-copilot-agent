import React from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="error-boundary">
      <div className="error-content">
        <h2>🐱 Oops! Something went wrong</h2>
        <p>Don't worry, we'll get this fixed for your cats!</p>
        <details className="error-details">
          <summary>Technical Details</summary>
          <pre>{error.message}</pre>
        </details>
        <div className="error-actions">
          <button onClick={resetErrorBoundary} className="retry-btn">
            Try Again
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="home-btn"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

ErrorFallback.propTypes = {
  error: PropTypes.instanceOf(Error).isRequired,
  resetErrorBoundary: PropTypes.func.isRequired,
};

function ErrorBoundary({ children, onError, fallback, ...props }) {
  const handleError = (error, errorInfo) => {
    // Log error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Call custom error handler if provided
    if (onError) {
      onError(error, errorInfo);
    }
    
    // In a real app, you might send this to an error reporting service
    // trackError(error, errorInfo);
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={fallback || ErrorFallback}
      onError={handleError}
      {...props}
    >
      {children}
    </ReactErrorBoundary>
  );
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onError: PropTypes.func,
  fallback: PropTypes.elementType,
};

export default ErrorBoundary;