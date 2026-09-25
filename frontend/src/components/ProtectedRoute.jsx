import { Navigate } from 'react-router-dom'
import { getUserRole, isAdmin, isUserAuthenticated } from '../utils/authUtils'

/**
 * Protected Route component to restrict access to authenticated users only
 */
export function ProtectedRoute({ children }) {
  if (!isUserAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return children
}

/**
 * Public Route component to prevent authenticated users from accessing auth pages
 */
export function PublicRoute({ children }) {
  if (isUserAuthenticated()) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export function RoleRoute({ children, role }) {
  if (!isUserAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  if (role === 'admin' && !isAdmin()) {
    return <Navigate to="/shop" replace />
  }

  if (role === 'customer' && getUserRole().toLowerCase() === 'admin') {
    return <Navigate to="/admin" replace />
  }

  return children
}
