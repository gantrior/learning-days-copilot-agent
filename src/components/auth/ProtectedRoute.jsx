import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../Loading';

function ProtectedRoute({ children, redirectTo = '/' }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication status
  if (loading) {
    return (
      <div className="protected-route-loading">
        <Loading />
        <p>Verifying authentication...</p>
      </div>
    );
  }

  // If not authenticated, redirect to specified page and remember where they were trying to go
  if (!isAuthenticated) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location, authRequired: true }}
        replace 
      />
    );
  }

  // If authenticated, render the protected component
  return children;
}

export default ProtectedRoute;