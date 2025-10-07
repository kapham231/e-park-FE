import axios from 'axios'
import { tokenManager } from '../utils/tokenManager'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api'

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Cho phép gửi cookies (refresh token)
})

// Request Interceptor - Tự động thêm token vào header
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response Interceptor - Handle token expiration
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Nếu token hết hạn và chưa retry
    if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Gọi API refresh token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })

        const { accessToken } = response.data.data

        // Lưu token mới
        tokenManager.setToken(accessToken)

        // Retry request ban đầu với token mới
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed - redirect to login
        tokenManager.clearAll()
        window.location.href = '/welcome'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
