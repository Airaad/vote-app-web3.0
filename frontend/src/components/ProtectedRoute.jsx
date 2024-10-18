import React from 'react';
import { useAuth } from '../AuthContext'; // Import the context hook
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth(); // Get the current user

  // If no user is authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/" />;
  }

  // Allow access to the protected component
  return children;
};

export default ProtectedRoute;
