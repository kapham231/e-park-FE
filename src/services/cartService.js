// src/services/cartService.js
import api from './api' // Axios instance with interceptors

/**
 * Cart Service
 * All cart-related API calls
 */
export const cartService = {
  /**
   * Get user's cart
   * GET /api/cart
   */
  getCart: async () => {
    try {
      const response = await api.get('/cart')
      return response.data.data
    } catch (error) {
      console.error('Get cart error:', error)
      throw error
    }
  },

  /**
   * Get user's cart quantity
   * GET /api/cart
   * (only returns totalItems)
   */
  getCartQuantity: async () => {
    try {
      const response = await api.get('/cart')
      return response.data.data.totalItems || 0
    } catch (error) {
      console.error('Get cart quantity error:', error)
      throw error
    }
  },

  /**
   * Add item to cart
   * POST /api/cart/items
   */
  addItem: async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart/items', {
        productId,
        quantity
      })
      return response.data.data
    } catch (error) {
      console.error('Add item error:', error)
      throw error
    }
  },

  /**
   * Update item quantity
   * PUT /api/cart/items/:productId
   */
  updateItem: async (productId, quantity) => {
    try {
      const response = await api.put(`/cart/items/${productId}`, {
        quantity
      })
      return response.data.data
    } catch (error) {
      console.error('Update item error:', error)
      throw error
    }
  },

  /**
   * Remove item from cart
   * DELETE /api/cart/items/:productId
   */
  removeItem: async (productId) => {
    try {
      const response = await api.delete(`/cart/items/${productId}`)
      return response.data.data
    } catch (error) {
      console.error('Remove item error:', error)
      throw error
    }
  },

  /**
   * Clear entire cart
   * DELETE /api/cart
   */
  clearCart: async () => {
    try {
      const response = await api.delete('/cart')
      return response.data.data
    } catch (error) {
      console.error('Clear cart error:', error)
      throw error
    }
  },

  /**
   * Validate cart before checkout
   * POST /api/cart/validate
   */
  validateCart: async () => {
    try {
      const response = await api.post('/cart/validate')
      return {
        isValid: response.data.success,
        cart: response.data.data
      }
    } catch (error) {
      if (error.response?.status === 400) {
        // Validation errors
        return {
          isValid: false,
          errors: error.response.data.errors || []
        }
      }
      console.error('Validate cart error:', error)
      throw error
    }
  },

  /**
   * Checkout cart
   * POST /api/cart/checkout
   */
  checkout: async (paymentInfo) => {
    try {
      const response = await api.post('/cart/checkout', paymentInfo)
      return response.data.data
    } catch (error) {
      console.error('Checkout error:', error)
      throw error
    }
  }
}

export default cartService
