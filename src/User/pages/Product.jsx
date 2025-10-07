import { useEffect, useState } from 'react'
import { getProducts } from '@/services/userApi'
import { Badge, message, Select } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import ProductItem from '../components/ProductItem'

import '../css/Product.css'
import SearchBar from '@/components/SearchBar'
import { Link } from 'react-router-dom'
import cartService from '@/services/cartService'

const Product = () => {
  const [products, setProducts] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchProducts()
    fetchCartQuantity()
  }, [])

  const fetchProducts = async () => {
    try {
      const tempProducts = await getProducts()
      setProducts(tempProducts)
    } catch (error) {
      console.error('Error:', error)
      message.error('Failed to fetch events.')
    }
  }

  const fetchCartQuantity = async () => {
    try {
      const quantity = await cartService.getCartQuantity()
      setTotalItems(quantity)
    } catch (error) {
      console.error('Fetch cart quantity error:', error)
    }
  }

  const handleAddToCart = async (productId) => {
    try {
      await cartService.addItem(productId, 1)
      message.success('Product added to cart!')
      fetchCartQuantity()
    } catch (error) {
      console.error('Add to cart error:', error)
      message.error('Failed to add product to cart.')
    }
  }

  return (
    <div className='product-container'>
      <div className='product-header'>
        <Select
          value={filter}
          onChange={setFilter}
          className='product-type-filter'
          options={[
            { value: 'all', label: 'All' },
            { value: 'food', label: 'Food' },
            { value: 'drink', label: 'Drink' },
            { value: 'others', label: 'Others' }
          ]}
        />
        <div className='search-bar-container'>
          <SearchBar placeholder={'Search products...'} />
        </div>
        <Badge count={totalItems} showZero={!totalItems} offset={[-5, 5]}>
          <Link to={'/user/cart'} className='cart-icon-container'>
            <div className='cart-icon'>
              <ShoppingCartOutlined />
              <p>Cart</p>
            </div>
          </Link>
        </Badge>
      </div>
      <div className='product-list'>
        {products.map((product) => (
          <ProductItem product={product} key={product._id} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  )
}

export default Product
