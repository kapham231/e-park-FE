import api from './api'
import { tokenManager } from '../utils/tokenManager'

export const authService = {
  /**
   * Login
   */
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password })

    console.log(response)

    const { user, accessToken } = response.data.data

    // Lưu token và user info
    tokenManager.setToken(accessToken)
    tokenManager.setUser(user)

    // Fetch full user data để lấy branchId
    try {
      const fullUserData = await authService.getCurrentUser()
      tokenManager.setUser(fullUserData)
    } catch (error) {
      console.error('Error fetching full user data:', error)
      // Vẫn tiếp tục dù lỗi
    }

    return response.data
  },

  /**
   * Register
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData)

    const { user, accessToken } = response.data.data

    tokenManager.setToken(accessToken)
    tokenManager.setUser(user)

    return response.data
  },

  /**
   * Logout
   */
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } finally {
      tokenManager.clearAll()
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!tokenManager.getToken()
  }
}
