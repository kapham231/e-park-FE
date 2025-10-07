import { useAuth } from '@/contexts/AuthContext'
import { message } from 'antd'

const ProductItem = ({ product, onAddToCart }) => {
  const auth = useAuth()

  return (
    <div className='flex flex-col border gap-2 border-gray-300 rounded-[24px] p-[10px] hover:shadow-lg transition-shadow'>
      <img src={product.image} alt='Product' className='w-full h-56 object-cover rounded-[14px]' />
      <div className='flex justify-between items-center'>
        <div className='inline-block bg-green-50 text-green-600 text-sm font-medium px-2 py-1 rounded-lg'>
          {product.typeName}
        </div>
      </div>
      <div className='text-xl font-bold text-gray-900 px-[2px] py-[2px]'>{product.name}</div>
      <div className='flex justify-between items-center mt-auto px-[2px]'>
        <div>
          <p className='text-sm text-gray-500 mb-1'>Price</p>
          <p className='text-xl font-semibold text-green-600'>₫{product.purchasePrice.toLocaleString('vi-VN')}</p>
        </div>
        <div
          className='bg-[#ff6363] hover:bg-[#ff4444] cursor-pointer text-white font-semibold rounded-2xl px-3 py-2 transition-colors whitespace-nowrap'
          onClick={() => {
            if (auth.isAuthenticated) {
              onAddToCart(product._id)
            } else {
              message.info('Please log in to add items to your cart.')
            }
          }}
        >
          Add to Cart
        </div>
      </div>
    </div>
  )
}

export default ProductItem
