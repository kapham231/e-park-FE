import { useState } from 'react'

const CartItem = ({ cartItem, onUpdateQuantity, onRemove, disabled = false }) => {
  const [quantity, setQuantity] = useState(cartItem.quantity)
  const [isUpdating, setIsUpdating] = useState(false)

  /**
   * Handle quantity decrease
   */
  const handleDecrease = async () => {
    if (quantity === 1) {
      await handleRemove()
      return
    }

    if (quantity <= 0 || disabled || isUpdating) return

    const newQuantity = quantity - 1
    setQuantity(newQuantity)
    setIsUpdating(true)

    try {
      await onUpdateQuantity(cartItem.productId._id, newQuantity)
    } catch (error) {
      // Revert on error
      setQuantity(quantity)
    } finally {
      setIsUpdating(false)
    }
  }

  /**
   * Handle quantity increase
   */
  const handleIncrease = async () => {
    if (disabled || isUpdating) return

    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    setIsUpdating(true)

    try {
      await onUpdateQuantity(cartItem.productId._id, newQuantity)
    } catch (error) {
      // Revert on error
      setQuantity(quantity)
    } finally {
      setIsUpdating(false)
    }
  }

  /**
   * Handle manual quantity input
   */
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1
    if (value < 1) return
    setQuantity(value)
  }

  /**
   * Handle quantity blur (when user finishes typing)
   */
  const handleQuantityBlur = async () => {
    if (quantity === cartItem.quantity || disabled || isUpdating) return
    if (quantity < 1) {
      setQuantity(cartItem.quantity)
      return
    }

    setIsUpdating(true)

    try {
      await onUpdateQuantity(cartItem.productId._id, quantity)
    } catch (error) {
      // Revert on error
      setQuantity(cartItem.quantity)
    } finally {
      setIsUpdating(false)
    }
  }

  /**
   * Handle remove item
   */
  const handleRemove = async () => {
    if (disabled || isUpdating) return

    console.log(1)

    if (!window.confirm(`Remove "${cartItem.name}" from your cart?`)) return

    setIsUpdating(true)
    try {
      await onRemove(cartItem.productId._id)
    } catch (error) {
      console.error('Remove error:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className='grid grid-cols-[1fr_max-content] sm:grid-cols-[2fr_1fr_1fr] gap-2 sm:gap5 items-center py-6 border-t border-gray-200'>
      {/* Product Info */}
      <div className='flex items-center gap-2 min-w-0'>
        {/* Product Image */}
        <div className='flex-shrink-0'>
          <img
            src={cartItem.image || 'https://via.placeholder.com/140'}
            alt={cartItem.name}
            className='w-16 lg:w-24 h-auto aspect-square object-cover rounded-xl'
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/140'
            }}
          />
        </div>

        {/* Product Details */}
        <div className='flex-1 min-w-0'>
          <h5 className='text-lg lg:text-xl font-semibold text-gray-900 mb-2 truncate'>{cartItem.name}</h5>

          <p className='hidden sm:block text-sm lg:text-base text-gray-500 mb-2'>Mã: {cartItem.code}</p>

          <h6 className='text-base lg:text-lg text-indigo-600 font-medium'>
            {cartItem.purchasePrice.toLocaleString('vi-VN')} đ
          </h6>
        </div>
      </div>

      {/* Quantity Control */}
      <div className='flex items-center justify-center lg:justify-center'>
        <div className='flex items-center border border-gray-300 rounded-full overflow-hidden'>
          {/* Decrease Button */}
          <button
            onClick={handleDecrease}
            disabled={quantity <= 0 || disabled || isUpdating}
            className='bg-white border-r border-gray-300 px-3 lg:px-4 py-1 lg:py-2 text-base lg:text-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            aria-label='Decrease quantity'
          >
            -
          </button>

          {/* Quantity Input */}
          <input
            type='number'
            min='1'
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
            disabled={disabled || isUpdating}
            className='w-10 lg:w-12 py-1 lg:py-2 text-center font-semibold border-none outline-none text-base lg:text-lg text-gray-900 bg-transparent disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label='Quantity input'
          />

          {/* Increase Button */}
          <button
            onClick={handleIncrease}
            disabled={disabled || isUpdating}
            className='bg-white border-l border-gray-300 px-3 lg:px-4 py-1 lg:py-2 text-base lg:text-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            aria-label='Increase quantity'
          >
            +
          </button>
        </div>

        {/* Loading indicator */}
        {isUpdating && (
          <div className='ml-3'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600'></div>
          </div>
        )}
      </div>

      {/* Total Price & Remove */}
      <div className='col-span-2 sm:col-span-1 flex items-center justify-between lg:justify-center lg:flex-col lg:gap-3'>
        {/* Total Price */}
        <div className='text-xl lg:text-2xl font-bold text-indigo-600'>
          <span className='inline sm:hidden'>Total: </span>
          {cartItem.subtotal.toLocaleString('vi-VN')} đ
        </div>

        {/* Remove Button - Desktop */}
        <button
          onClick={handleRemove}
          disabled={disabled || isUpdating}
          className='block text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default CartItem
