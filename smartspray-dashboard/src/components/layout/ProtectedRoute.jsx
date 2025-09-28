import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../ui/LoadingSpinner'

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth()

  // Show loader while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Role-based access check
  if (requiredRole) {
    // Allow if user has required role OR is admin
    if (user?.role !== requiredRole && user?.role !== 'admin') {
      return <Navigate to="/" replace />
    }
  }

  // Authorized → render children
  return children
}

export default ProtectedRoute
