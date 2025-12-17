import { useCallback, useState, useEffect } from 'react'
import { Table, Button, Popconfirm, Input } from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import ProductModal from './productModal'
import { createProduct, deleteProductById, getAllProduct, updateProductById } from '../../services/playgroundmanagerApi'

const ProductList = () => {
  const [productList, setProductList] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    try {
      const productList = await getAllProduct()
      console.log('productList: ', productList)
      setProductList(productList)
    } catch (error) {
      console.error('Error fetching products:', error)
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
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity
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
      sorter: (a, b) => (a.purchasePrice || 0) - (b.purchasePrice || 0),
      render: (text) => text ? `${Number(text).toLocaleString('vi-VN')} VND` : '0 VND'
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
    if (editingProduct) {
      const updatedProduct = await updateProductById(editingProduct._id, values)
      const newProductList = productList.map((product) =>
        product._id === editingProduct._id ? { ...product, ...updatedProduct } : product
      )
      console.log(newProductList)
      setProductList(newProductList)
    } else {
      const newProduct = await createProduct(values)
      setProductList([...productList, newProduct])
      await load()
    }
    setIsModalVisible(false)
    setEditingProduct(null)
  }

  const handleEditProduct = (record) => {
    setEditingProduct(record)
    setIsModalVisible(true)
  }
  const handleDeleteProduct = async (id) => {
    await deleteProductById(id)
    load() // Reload the product list after deletion
  }
  const filteredTypes = productList.filter((product) =>
    product.name.toLowerCase().includes(searchText.toLowerCase())
  )
  const handleRowClick = (record) => {
    setEditingProduct(record)
    setIsModalVisible(true)
  }
  return (
    <div>
      <Button
        style={{ backgroundColor: '#3b71ca', color: 'white', marginBottom: '16px' }}
        icon={<PlusOutlined />}
        onClick={handleCreateProduct}
      >
        Add New Product
      </Button>
      <Input
        placeholder='Search products...'
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={{ width: 300, marginLeft: '16px' }}
      />
      <Table 
        dataSource={filteredTypes} 
        loading={loading} 
        columns={columns} 
        onRow={(record) => ({ onClick: () => handleRowClick(record) })}
      />

      <ProductModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleSubmitProduct}
        initialValues={editingProduct}
      />
    </div>
  )
}

export default ProductList
