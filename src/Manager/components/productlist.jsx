import { useCallback, useState, useEffect } from 'react'
import { Table, Button, Popconfirm } from 'antd'
import ProductModal from './productModal'
import { createProduct, deleteProductById, getAllProduct, updateProductById } from '../../services/playgroundmanagerApi'

const ProductList = () => {
  const [productList, setProductList] = useState(null)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const load = useCallback(async () => {
    try {
      const productList = await getAllProduct()
      setProductList(productList)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  })

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
      sorter: (a, b) => a.purchasePrice - b.purchasePrice,
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
    if (editingProduct) {
      const updatedProduct = await updateProductById(editingProduct._id, values)
      const newProductList = productList.map((product) =>
        product._id === editingProduct._id ? { ...product, ...updatedProduct } : product
      )
      console.log(newProductList)
      setProductList(newProductList)
    } else {
      const newProduct = await createProduct(values)
      // const newProductList = [...productList, newProduct];
      // setProductList(newProductList);
      await getAllProduct().then(setProductList(newProduct))
    }
    setIsModalVisible(false)
    setEditingProduct(null)
  }

  const handleEditProduct = (record) => {
    console.log(record)
    setEditingProduct(record)
    setIsModalVisible(true)
  }
  const handleDeleteProduct = async (id) => {
    const deleteProduct = await deleteProductById(id)
    const newProductList = productList.filter((product) => product._id !== id)
    setProductList(newProductList)
  }

  return (
    <div>
      <Button
        style={{ backgroundColor: '#3b71ca', color: 'white', marginBottom: '16px' }}
        onClick={handleCreateProduct}
      >
        Add New Product
      </Button>

      <Table dataSource={productList} columns={columns} />

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
