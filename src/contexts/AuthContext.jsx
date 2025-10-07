import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../services/authService'
import tokenManager from '../utils/tokenManager'
import { getHomepageByRole, ROLES } from '../config/roles'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  /**
   * Load user từ storage khi mount
   */
  useEffect(() => {
    initializeAuth()
  }, [])

  /**
   * Initialize authentication state
   */
  const initializeAuth = async () => {
    try {
      setLoading(true)

      // Check if token exists
      const token = tokenManager.getToken()
      const storedUser = tokenManager.getUser()

      if (token && storedUser) {
        // Verify token còn valid không
        try {
          // Option 1: Trust stored user (faster)
          setUser(storedUser)

          // Option 2: Verify with backend (more secure)
          // const currentUser = await authService.getCurrentUser();
          // setUser(currentUser);
        } catch (error) {
          console.error('Token verification failed:', error)
          // Token invalid - clear auth
          tokenManager.clearAll()
          setUser(null)
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Login với Remember Me option
   */
  const login = async (username, password, rememberMe = false) => {
    try {
      const result = await authService.login(username, password)
      const { user: userData, accessToken } = result.data

      // Save token và user với remember option
      tokenManager.setAuth(accessToken, userData, rememberMe)

      setUser(userData)

      // Navigate dựa trên role
      navigateToHomepage(userData.role)

      return result
    } catch (error) {
      throw error
    }
  }

  /**
   * Register với Remember Me option
   */
  const register = async (userData, rememberMe = false) => {
    try {
      const result = await authService.register(userData)
      const { user: newUser, accessToken } = result.data

      // Save token và user với remember option
      tokenManager.setAuth(accessToken, newUser, rememberMe)

      setUser(newUser)

      // Navigate dựa trên role
      navigateToHomepage(newUser.role)

      return result
    } catch (error) {
      throw error
    }
  }

  /**
   * Navigate to homepage dựa trên user role
   */
  const navigateToHomepage = (role) => {
    // Check if there's a return URL
    const from = location.state?.from

    if (from) {
      // Redirect về trang user muốn truy cập trước đó
      navigate(from, { replace: true })
    } else {
      // Navigate về homepage của role
      const homepage = getHomepageByRole(role)

      console.log(homepage)
      navigate(homepage, { replace: true })
    }
  }

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      tokenManager.clearAll()
      setUser(null)
      navigate('/welcome', { replace: true })
    }
  }

  /**
   * Update user info in context
   */
  const updateUser = (updatedUser) => {
    const isRemembered = tokenManager.isRemembered()
    tokenManager.setUser(updatedUser, isRemembered)
    setUser(updatedUser)
  }

  /**
   * Check if user has specific role
   */
  const hasRole = (role) => {
    return user?.role === role
  }

  /**
   * Check if user has any of the roles
   */
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role)
  }

  /**
   * Get current storage type
   */
  const getStorageType = () => {
    return tokenManager.isRemembered() ? 'localStorage' : 'sessionStorage'
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    hasRole,
    hasAnyRole,
    isRemembered: tokenManager.isRemembered(),
    storageType: getStorageType(),
    navigateToHomepage: () => navigateToHomepage(user?.role)
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook để sử dụng Auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
