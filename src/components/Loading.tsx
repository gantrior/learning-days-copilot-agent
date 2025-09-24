import React from 'react';

interface LoadingProps {
  message?: string;
}

function Loading({ message = "Loading..." }: LoadingProps) {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="cat-spinner">
          🐱
        </div>
      </div>
      <p className="loading-message">{message}</p>
    </div>
  );
}

export default Loading;