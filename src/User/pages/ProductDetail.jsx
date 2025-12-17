import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '@/services/userApi'
import { Button, message } from 'antd'
import { ShoppingCartOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useAuth } from '@/contexts/AuthContext'
import cartService from '@/services/cartService'
import '../css/Product.css'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const auth = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    if (!id) return
    const fetch = async () => {
      try {
        const data = await getProductById(id)
        setProduct(data)
      } catch (err) {
        console.error('Failed to fetch product:', err)
        message.error('Không thể tải thông tin sản phẩm.')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  const handleAddToCart = async () => {
    if (!auth.isAuthenticated) {
      message.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.')
      return
    }
    if (!product || !product._id) return
    try {
      setAdding(true)
      await cartService.addItem(product._id, 1)
      message.success('Đã thêm vào giỏ hàng')
    } catch (err) {
      console.error('Add to cart failed', err)
      message.error('Thêm vào giỏ hàng thất bại')
    } finally {
      setAdding(false)
    }
  }

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>
  if (!product) return <div style={{ padding: 20 }}>Product not found.</div>

  return (
    <div className='product-detail-wrapper' style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <div className='product-detail-card' style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 380px' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 12, objectFit: 'cover' }} />
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ margin: 0 }}>{product.name}</h1>
          <div style={{ marginTop: 8, color: '#6b7280' }}>{product.typeName}</div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16, alignItems: 'center' }}>
            <div style={{ fontSize: 22, color: '#16a34a', fontWeight: 700 }}>
              ₫{(product.purchasePrice ?? 0).toLocaleString('vi-VN')}
            </div>
            <div style={{ color: '#374151' }}>
              <small>Code: {product.code || product.productCode || '—'}</small>
            </div>
            <div style={{ marginLeft: 'auto', color: '#374151' }}>
              <small>Stock: {product.quantity ?? product.stock ?? 0}</small>
            </div>
          </div>

          <div style={{ marginTop: 18, color: '#111827', lineHeight: 1.6 }}>
            <p style={{ marginBottom: 8 }}><strong>Mô tả</strong></p>
            <div style={{ color: '#4b5563' }}>{product.description || 'Không có mô tả.'}</div>
          </div>

          <div style={{ marginTop: 22, display: 'flex', gap: 12 }}>
            <Button
              type='primary'
              danger
              size='large'
              loading={adding}
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              style={{ borderRadius: 8, fontWeight: 600 }}
            >
              Add to Cart
            </Button>
            <Button
              size='large'
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
              style={{ borderRadius: 8 }}
            >
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
