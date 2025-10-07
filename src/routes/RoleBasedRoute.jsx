import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const RoleBasedRoute = ({ children, allowedRoles = [], redirectTo = '/unauthorized' }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to='/login' replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}
