import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { canAccessRoute } from '../config/roles'

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className='loading-screen'>
        <div className='spinner'></div>
        <p>Đang tải...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login, save current location
    return <Navigate to='/welcome' state={{ from: location.pathname }} replace />
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // User không có quyền truy cập
    return <Navigate to='/unauthorized' replace />
  }

  // Check route-specific access
  if (!canAccessRoute(location.pathname, user?.role)) {
    return <Navigate to='/unauthorized' replace />
  }

  return children
}
