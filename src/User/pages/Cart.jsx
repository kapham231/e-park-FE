import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import cartService from '@/services/cartService'
import { message } from 'antd'
import CartItem from '../components/CartItem'
import { createPayOS } from '@/services/userApi'
import { downloadProductInvoice } from '@/utils/download-product-invoice'

const Cart = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [form, setForm] = useState({
    address: '',
    method: 'cod' // cod or online
  })
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  /**
   * Fetch cart data
   */
  const fetchCart = async () => {
    try {
      setLoading(true)
      const cartData = await cartService.getCart()
      setCart(cartData)
    } catch (error) {
      console.error('Fetch cart error:', error)

      if (error.response?.status === 401) {
        message.error('Please login to view your cart')
        navigate('/welcome')
      } else {
        message.error('Cannot load cart data')
      }
    } finally {
      setLoading(false)
    }
  }

  /**
   * Update item quantity
   */
  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      setUpdating(true)
      console.log(productId, newQuantity)
      await cartService.updateItem(productId, newQuantity)
      await fetchCart() // Reload cart
      message.success('Product quantity updated')
    } catch (error) {
      console.error('Update quantity error:', error)
      message.error(error.response?.data?.message || 'Cannot update item quantity')
    } finally {
      setUpdating(false)
    }
  }

  /**
   * Remove item from cart
   */
  const handleRemoveItem = async (productId) => {
    try {
      setUpdating(true)
      await cartService.removeItem(productId)
      await fetchCart()
      message.success('Product has been removed from cart')
    } catch (error) {
      console.error('Remove item error:', error)
      message.error(error.response?.data?.message || 'Cannot remove item from cart')
    } finally {
      setUpdating(false)
    }
  }

  /**
   * Clear entire cart
   */
  const handleClearCart = async () => {
    if (!window.confirm('Are you sure to remove all cart items?')) return

    try {
      setUpdating(true)
      await cartService.clearCart()
      await fetchCart()
      message.success('All cart items removed')
    } catch (error) {
      console.error('Clear cart error:', error)
      message.error('Cannot clear cart')
    } finally {
      setUpdating(false)
    }
  }

  /**
   * Proceed to checkout
   */
  const handleCheckout = async (cartId) => {
    try {
      // Validate cart before checkout
      const validation = await cartService.validateCart()

      if (!validation.isValid) {
        const errorMessages = validation.errors.map((e) => e.message).join('\n')
        message.error({
          content: (
            <div>
              <p>Cart has problem:</p>
              <ul>
                {validation.errors.map((err, idx) => (
                  <li key={idx}>{err.message}</li>
                ))}
              </ul>
            </div>
          ),
          duration: 5
        })
        return
      }

      // Navigate to checkout
      const paymentInfo = {
        shippingAddress: form.address,
        deliveryCharge: 20000 // Fixed or calculate based on cart total
      }

      const invoice = await cartService.checkout(paymentInfo)

      console.log(invoice)

      if (form.method === 'online') {
        const payOS = await createPayOS(invoice._id)
        if (payOS) {
          window.location.href = payOS // Chuyển hướng đến trang thanh toán của PayOS
        } else {
          message.error('Failed to initiate payment. Please try again.')
        }
      } else {
        downloadProductInvoice(invoice)
        message.success('Checkout successful. Please check your orders.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      message.error('Cannot proceed to checkout')
    }
  }

  // Loading state
  if (loading) {
    return (
      <section className='py-24'>
        <div className='max-w-7xl mx-auto px-8 text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600'></div>
          <p className='mt-4 text-gray-600'>Loading cart item...</p>
        </div>
      </section>
    )
  }

  // Empty cart
  if (!cart || cart.items.length === 0) {
    return (
      <section className='py-24'>
        <div className='max-w-7xl mx-auto px-8 text-center'>
          <div className='mb-6'>
            <svg className='mx-auto h-24 w-24 text-gray-300' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
              />
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-gray-900 mb-4'>Cart is empty!!</h2>
          <p className='text-gray-600 mb-8'>You don't have any product on your cart.</p>
          <div
            onClick={() => navigate('/user/product')}
            className='inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-colors cursor-pointer'
          >
            Shopping now!!
          </div>
        </div>
      </section>
    )
  }

  // Calculate delivery charge (example: 10% of subtotal or fixed)
  const deliveryCharge = 20000 // Fixed 45k VND or calculate based on total

  return (
    <section className='py-6 relative'>
      <div className='w-full max-w-7xl px-8 mx-auto'>
        {/* Title */}
        <h2 className='text-4xl font-bold text-center'>Product Cart</h2>

        {/* Cart Info */}
        <div className='text-center text-gray-600'>
          <p>
            You have <span className='font-semibold text-indigo-600'>{cart.totalItems}</span> products in your cart
          </p>
        </div>

        <div className='w-full grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-5 mt-10'>
          <div className='lg:col-span-2'>
            {/* Headers - Desktop only */}
            <div className='hidden lg:grid lg:grid-cols-[2fr_1fr_1fr] py-4 gap-5 text-gray-500 text-xl border-b border-gray-200'>
              <div>Product</div>
              <div className='text-center'>Quantity</div>
              <div className='text-center'>Total Price</div>
            </div>

            {/* Cart Items */}
            <div className='divide-y divide-gray-200'>
              {cart.items.map((item) => (
                <CartItem
                  key={item.productId._id}
                  cartItem={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  disabled={updating}
                />
              ))}
            </div>

            {/* Clear Cart Button */}
            {cart.items.length > 0 && (
              <div className='mt-2'>
                <div
                  onClick={handleClearCart}
                  disabled={updating}
                  className='w-max px-3 py-2 mx-auto cursor-pointer text-center border border-red-400 text-red-600 hover:text-white hover:bg-red-400 rounded-2xl font-medium disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Clear cart
                </div>
              </div>
            )}
          </div>

          <div>
            {/* Cart Summary */}
            <div className='bg-gray-50 rounded-xl p-6 my-2 max-w-2xl mx-auto'>
              <div className='flex justify-between mb-2 text-xl text-gray-500'>
                <span>Subtotal</span>
                <span>{cart.totalPrice.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className='flex justify-between mb-3 text-xl text-gray-500'>
                <span>Shipping cost</span>
                <span>{deliveryCharge.toLocaleString('vi-VN')} đ</span>
              </div>

              <div className='flex justify-between pt-3 border-t border-gray-300 text-2xl font-semibold text-gray-900'>
                <span>Total</span>
                <span className='text-indigo-600'>{(cart.totalPrice + deliveryCharge).toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            {/* Delivery form */}
            <div className='bg-gray-50 rounded-xl p-6 my-2 max-w-2xl mx-auto'>
              <form action='' className=''>
                <h3 className='text-2xl font-semibold text-gray-900 mb-4'>Delivery Information</h3>
                <div className='flex flex-col gap-4'>
                  <div>
                    <label htmlFor='address' className='block text-gray-700 mb-1'>
                      Address
                    </label>
                    <input
                      type='text'
                      id='address'
                      name='address'
                      className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      placeholder='Your delivery address'
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor='method' className='block text-gray-700 mb-1'>
                      Payment Method
                    </label>
                    <select
                      name='method'
                      id='method'
                      className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500'
                      value={form.method}
                      onChange={(e) => setForm({ ...form, method: e.target.value })}
                    >
                      <option value='cod'>Cash on Delivery</option>
                      <option value='online'>Online Payment</option>
                    </select>
                  </div>
                </div>
              </form>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col gap-4 items-center justify-center max-w-2xl mx-auto'>
              <div
                onClick={handleCheckout}
                disabled={updating}
                className='cursor-pointer w-full bg-indigo-600 text-white font-semibold rounded-full py-4 px-6 flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Checkout
                <svg xmlns='http://www.w3.org/2000/svg' width='23' height='22' viewBox='0 0 23 22' fill='none'>
                  <path
                    d='M8.75324 5.49609L14.2535 10.9963L8.75 16.4998'
                    stroke='white'
                    strokeWidth='1.6'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>

              <div
                onClick={() => navigate(-1)}
                className='cursor-pointer w-full bg-indigo-50 text-indigo-600 font-semibold rounded-full py-4 px-6 flex items-center justify-center gap-2 hover:bg-indigo-100 transition-all'
              >
                Continue shopping
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Cart
