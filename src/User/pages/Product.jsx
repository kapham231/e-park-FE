import { useEffect, useState, useMemo } from 'react'
import { getProducts } from '@/services/userApi'
import { getAllProductType } from '@/services/playgroundmanagerApi'
import { Badge, message, Select } from 'antd'
import { ShoppingCartOutlined } from '@ant-design/icons'
import ProductItem from '../components/ProductItem'

import '../css/Product.css'
import SearchBar from '@/components/SearchBar'
import { Link } from 'react-router-dom'
import cartService from '@/services/cartService'

const Product = () => {
  const [products, setProducts] = useState([])
  const [productTypes, setProductTypes] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchProductTypes()
    fetchCartQuantity()
  }, [])

  const fetchProducts = async () => {
    try {
      const tempProducts = await getProducts()
      setProducts(tempProducts)
    } catch (error) {
      console.error('Error:', error)
      message.error('Failed to fetch products.')
    }
  }

  const fetchProductTypes = async () => {
    try {
      const types = await getAllProductType()
      setProductTypes(types)
    } catch (error) {
      console.error('Error fetching product types:', error)
      message.error('Failed to fetch product types.')
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

  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesType = filter === 'all' || product.typeName === filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [products, filter, searchTerm])

  const productTypeOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'All' }]
    productTypes.forEach((type) => {
      options.push({ value: type.typeName, label: type.typeName })
    })
    return options
  }, [productTypes])

  return (
    <div className='product-container'>
      <div className='product-header'>
        <Select
          value={filter}
          onChange={setFilter}
          className='product-type-filter'
          options={productTypeOptions}
        />
        <div className='search-bar-container'>
          <SearchBar placeholder={'Search products...'} onSearch={handleSearch} onClear={() => setSearchTerm('')} />
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
        {filteredProducts.map((product) => (
          <ProductItem product={product} key={product._id} onAddToCart={handleAddToCart} />
        ))}
      </div>
    </div>
  )
}

export default Product
