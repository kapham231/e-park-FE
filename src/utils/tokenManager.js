const TOKEN_KEY = 'accessToken'
const USER_KEY = 'user'
const REMEMBER_KEY = 'rememberMe'

/**
 * Storage Manager
 * Tự động chọn localStorage hoặc sessionStorage
 */
class StorageManager {
  constructor() {
    this.isRemembered = this.checkRememberMe()
  }

  /**
   * Check xem user có chọn Remember Me không
   */
  checkRememberMe() {
    // localStorage.getItem luôn persist
    return localStorage.getItem(REMEMBER_KEY) === 'true'
  }

  /**
   * Set Remember Me preference
   */
  setRememberMe(remember) {
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, 'true')
    } else {
      localStorage.removeItem(REMEMBER_KEY)
    }
    this.isRemembered = remember
  }

  /**
   * Lấy storage dựa trên Remember Me
   */
  getStorage() {
    return this.isRemembered ? localStorage : sessionStorage
  }

  /**
   * Set item vào storage phù hợp
   */
  setItem(key, value) {
    const storage = this.getStorage()
    storage.setItem(key, value)
  }

  /**
   * Get item từ cả 2 storage (fallback)
   */
  getItem(key) {
    // Thử localStorage trước
    let value = localStorage.getItem(key)
    if (value) return value

    // Fallback to sessionStorage
    value = sessionStorage.getItem(key)
    return value
  }

  /**
   * Remove item từ cả 2 storage
   */
  removeItem(key) {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  }

  /**
   * Clear tất cả auth data
   */
  clearAll() {
    // Clear auth data nhưng giữ lại remember preference
    const remember = localStorage.getItem(REMEMBER_KEY)

    // Clear tokens
    this.removeItem(TOKEN_KEY)
    this.removeItem(USER_KEY)

    // Restore remember preference (optional)
    // if (remember) {
    //   localStorage.setItem(REMEMBER_KEY, remember);
    // }
  }
}

const storageManager = new StorageManager()

/**
 * Token Manager với Remember Me support
 */
export const tokenManager = {
  /**
   * Set token với remember option
   */
  setToken: (token, remember = false) => {
    storageManager.setRememberMe(remember)
    storageManager.setItem(TOKEN_KEY, token)
  },

  /**
   * Get token từ storage
   */
  getToken: () => {
    return storageManager.getItem(TOKEN_KEY)
  },

  /**
   * Remove token
   */
  removeToken: () => {
    storageManager.removeItem(TOKEN_KEY)
  },

  /**
   * Set user info với remember option
   */
  setUser: (user, remember = false) => {
    storageManager.setRememberMe(remember)
    storageManager.setItem(USER_KEY, JSON.stringify(user))
  },

  /**
   * Get user info
   */
  getUser: () => {
    const userStr = storageManager.getItem(USER_KEY)
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Parse user error:', error)
      return null
    }
  },

  /**
   * Remove user info
   */
  removeUser: () => {
    storageManager.removeItem(USER_KEY)
  },

  /**
   * Check if Remember Me is enabled
   */
  isRemembered: () => {
    return storageManager.isRemembered
  },

  /**
   * Clear all auth data
   */
  clearAll: () => {
    storageManager.clearAll()
  },

  /**
   * Set both token and user
   */
  setAuth: (token, user, remember = false) => {
    storageManager.setRememberMe(remember)
    storageManager.setItem(TOKEN_KEY, token)
    storageManager.setItem(USER_KEY, JSON.stringify(user))
  }
}

export default tokenManager
