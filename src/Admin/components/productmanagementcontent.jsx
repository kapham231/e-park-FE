import { useCallback, useState, useEffect } from 'react'
import { Table, Button, Popconfirm, message } from 'antd'
import ProductModal from '../../Admin/components/productModal'
import { createProduct, deleteProductById, getAllProduct, updateProductById } from '../../services/adminApi'

const ProductManagementContent = () => {
  const [productList, setProductList] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const load = useCallback(async () => {
    try {
      const list = await getAllProduct()
      setProductList(list)
    } catch (error) {
      console.error('Error fetching products:', error)
      message.error('Failed to load products')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity'
    },
    {
      title: 'Type',
      dataIndex: 'typeName',
      key: 'typeName'
    },
    {
      title: 'Sale Price',
      dataIndex: 'purchasePrice',
      key: 'purchasePrice',
      render: (text) => `${Number(text).toLocaleString('vi-VN')} VND`
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button type='link' onClick={() => handleEditProduct(record)}>
            Edit
          </Button>
          <Popconfirm
            title='Are you sure to delete this product?'
            onConfirm={() => handleDeleteProduct(record._id)}
            okText='Yes'
            cancelText='No'
          >
            <Button type='link' danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ]

  const handleCreateProduct = () => {
    setEditingProduct(null)
    setIsModalVisible(true)
  }

  const handleSubmitProduct = async (values) => {
    try {
      if (editingProduct) {
        await updateProductById(editingProduct._id, values)
        await load()
        message.success('Product updated successfully!')
      } else {
        await createProduct(values)
        await load()
        message.success('Product created successfully!')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      message.error('Failed to save product')
    } finally {
      setIsModalVisible(false)
      setEditingProduct(null)
    }
  }

  const handleEditProduct = (record) => {
    setEditingProduct(record)
    setIsModalVisible(true)
  }

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProductById(id)
      setProductList((prev) => prev.filter((p) => p._id !== id))
      message.success('Product deleted')
      window.location.reload() // Reload page after deleting product
    } catch (error) {
      console.error('Delete product error:', error)
      message.error('Failed to delete product')
    }
  }

  return (
    <div style={{ margin: '20px' }}>
      <Button style={{ backgroundColor: '#3b71ca', color: 'white', marginBottom: '16px' }} onClick={handleCreateProduct}>
        Add New Product
      </Button>

      <Table dataSource={productList} columns={columns} rowKey='_id' />

      <ProductModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onSubmit={handleSubmitProduct} initialValues={editingProduct} />
    </div>
  )
}

export default ProductManagementContent
