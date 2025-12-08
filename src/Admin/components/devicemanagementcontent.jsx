import React, { useEffect, useState } from 'react'
import { Button, Table, Popconfirm, message, Tag } from 'antd'
import {
  getAllDevice,
  createDevice,
  deleteDeviceById,
  updateDeviceById,
  getAllSupplier
} from '../../services/adminApi'
import DeviceModal from '../../Admin/components/devicemodal'

const DeviceManagementContent = () => {
  const [deviceList, setDeviceList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingDevice, setEditingDevice] = useState(null)

  // Determine tag color based on status
  const getStatusTagColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'success'
      case 'error':
        return 'error'
      case 'maintenance':
        return 'blue'
      default:
        return 'default'
    }
  }

  const columns = [
    {
      title: 'Device Type',
      dataIndex: 'typeName',
      key: 'typeName',
      ellipsis: true,
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.typeName.localeCompare(b.typeName),
      render: (text) => <span style={{ fontWeight: 'bold' }}>{text}</span>
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code)
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplier',
      ellipsis: true,
      sorter: (a, b) => a.supplierName.localeCompare(b.supplierName)
    },
    {
      title: 'Price',
      dataIndex: 'purchasePrice',
      key: 'price',
      render: (price) => {
        return `${price.toLocaleString()} VND`
      },
      sorter: (a, b) => a.purchasePrice - b.purchasePrice
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      filters: [
        { text: 'Available', value: 'available' },
        { text: 'Error', value: 'error' },
        { text: 'Maintenance', value: 'maintenance' }
      ],
      onFilter: (value, record) => record.status?.toLowerCase() === value,
      render: (status) => (
        <Tag color={getStatusTagColor(status)} key={status}>
          {status || 'Unknown'}
        </Tag>
      )
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button type='link' onClick={() => handleEditDevice(record)}>
            Edit
          </Button>
          <Popconfirm
            title='Are you sure to delete this device?'
            onConfirm={() => handleDeleteDevice(record._id)}
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

  useEffect(() => {
    fetchDeviceList()
  }, [])

  const fetchDeviceList = async () => {
    try {
      const tmpDeviceList = await getAllDevice()
      const suppliersList = await getAllSupplier()

      if (!tmpDeviceList || tmpDeviceList.length === 0) {
        setDeviceList([])
        return
      }

      const supplierMap = suppliersList.reduce((map, supplier) => {
        map[supplier._id] = supplier.name
        return map
      }, {})

      const devicesWithSupplierName = tmpDeviceList.map((device) => ({
        ...device,
        supplierName: supplierMap[device.supplierId] || 'N/A'
      }))

      setDeviceList(devicesWithSupplierName)
    } catch (error) {
      console.error('Error fetching devices:', error)
      message.error('Failed to fetch devices: ' + error.message)
    }
  }

  const handleCreateDevice = () => {
    setEditingDevice(null)
    setIsModalVisible(true)
  }

  const handleEditDevice = (device) => {
    setEditingDevice(device)
    setIsModalVisible(true)
  }

  const handleDeleteDevice = async (id) => {
    await deleteDeviceById(id)
    setDeviceList(deviceList.filter((device) => device._id !== id))
    message.success('Device deleted successfully!')
  }

  const handleSubmitDevice = async (device) => {
    if (editingDevice) {
      await updateDeviceById(editingDevice._id, device)
      fetchDeviceList()
      message.success('Device updated successfully!')
    } else {
      await createDevice(device)
      fetchDeviceList()
      message.success('Device added successfully!')
    }
    setIsModalVisible(false)
  }

  return (
    <div style={{ margin: '20px' }}>
      <Button style={{ backgroundColor: '#3b71ca', color: 'white', marginBottom: '16px' }} onClick={handleCreateDevice}>
        Add Device
      </Button>

      <Table
        columns={columns}
        dataSource={deviceList}
        rowKey='_id'
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} devices`,
          style: { marginTop: '16px', textAlign: 'right' }
        }}
        scroll={{ x: 'max-content' }}
        style={{ marginTop: '20px' }}
      />
      <DeviceModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleSubmitDevice}
        initialValues={editingDevice}
      />
    </div>
  )
}

export default DeviceManagementContent
