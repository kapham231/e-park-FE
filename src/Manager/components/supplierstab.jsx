import React, { useEffect, useState } from 'react'
import { Card, Avatar, Typography, Button, Popconfirm, message } from 'antd'
import { Flex } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import AddSupplierModal from './addsuppliermodal'
import {
  createSupplier,
  deleteSupplierById,
  getAllSupplier,
  updateSupplierById
} from '../../services/playgroundmanagerApi'

const { Title, Text } = Typography

const pastelColors = ['#FFF4E6', '#E6F7FF', '#E8F5E9', '#FCE4EC', '#EDE7F6', '#E3F2FD', '#E8F5E9', '#FFFDE7']

const SuppliersTab = () => {
  const [suppliers, setSuppliers] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState(null)

  useEffect(() => {
    // Lấy danh sách nhà cung cấp từ API
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    const suppliersList = await getAllSupplier()
    setSuppliers(
      suppliersList.map((supplier) => ({
        ...supplier,
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)] // Gán màu ngẫu nhiên
      }))
    )
  }

  const handleAddSupplier = async (newSupplier) => {
    // const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)]; // Chọn màu ngẫu nhiên
    const newSup = await createSupplier(newSupplier)
    setSuppliers((prevSuppliers) => [
      ...prevSuppliers,
      { ...newSup, color: pastelColors[Math.floor(Math.random() * pastelColors.length)] } // Gán màu ngẫu nhiên
    ])
    message.success(`Added new supplier: ${newSupplier.name}`)
  }

  const handleEditSupplier = async (updatedSupplier) => {
    const updateSupplier = await updateSupplierById(editingSupplier._id, updatedSupplier)
    setSuppliers((prevSuppliers) =>
      prevSuppliers.map((supplier) =>
        supplier._id === editingSupplier._id ? { ...supplier, ...updateSupplier } : supplier
      )
    )
    message.success(`Updated supplier: ${updatedSupplier.name}`)
  }

  const handleDelete = async (id) => {
    await deleteSupplierById(id)
    setSuppliers(suppliers.filter((supplier) => supplier._id !== id))
    message.success('Supplier deleted successfully!')
  }

  if (!suppliers.length) {
    return <Text>No suppliers available.</Text> // Hiển thị thông báo nếu không có nhà cung cấp nào
  }

  return (
    <>
      <Button
        style={{ backgroundColor: '#3b71ca', color: 'white', marginBottom: 16 }}
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingSupplier(null) // Chế độ thêm mới
          setIsModalVisible(true)
        }}
      >
        Add Supplier
      </Button>
      <Flex wrap='wrap' gap='large' justify='center'>
        {suppliers.map((supplier) => (
          <Card
            key={supplier.id}
            hoverable
            bordered={false}
            style={{
              width: 360,
              borderRadius: 20,
              backgroundColor: supplier.color || pastelColors[Math.floor(Math.random() * pastelColors.length)],
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              padding: 16
            }}
          >
            <Flex align='center' gap='middle' style={{ marginBottom: 12 }}>
              <Avatar
                size={48}
                src={supplier.logo}
                alt={`${supplier.name} logo`}
                style={{
                  backgroundColor: '#fff'
                }}
              />
              <Title level={4} style={{ margin: 0 }}>
                {supplier.name}
              </Title>
            </Flex>
            <Text strong>📧 Email: </Text>
            <Text>{supplier.email}</Text>
            <br />
            <Text strong>📞 Phone: </Text>
            <Text>{supplier.phoneNumber}</Text>

            {/* Action buttons */}
            <Flex justify='flex-end' gap='small' style={{ marginTop: 16 }}>
              <Button
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingSupplier(supplier) // Chế độ chỉnh sửa
                  setIsModalVisible(true)
                }}
                style={{
                  backgroundColor: '#FFE58F', // Vàng pastel
                  color: '#8C6D1F', // Vàng đậm hơn cho chữ
                  border: 'none'
                }}
              >
                Edit
              </Button>

              <Popconfirm
                title='Bạn có chắc muốn xóa nhà cung cấp này không?'
                onConfirm={() => handleDelete(supplier._id)}
                okText='Xóa'
                cancelText='Hủy'
              >
                <Button danger icon={<DeleteOutlined />}>
                  Delete
                </Button>
              </Popconfirm>
            </Flex>
          </Card>
        ))}
      </Flex>

      {/* Add/Edit Supplier Modal */}
      <AddSupplierModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={editingSupplier ? handleEditSupplier : handleAddSupplier}
        initialValues={editingSupplier} // Điền thông tin nếu chỉnh sửa
      />
    </>
  )
}

export default SuppliersTab
