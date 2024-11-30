import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactElement;
  allowedGroups?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, allowedGroups }) => {
  const isAuthenticated = !!localStorage.getItem('access_token');
  const userGroups = localStorage.getItem('groups')?.split(',') || [];

  const hasRequiredGroup = !allowedGroups || userGroups.some((group) => allowedGroups.includes(group));

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedGroups && !hasRequiredGroup) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;
