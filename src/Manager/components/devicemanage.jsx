import React, { useEffect, useState } from 'react'
import { Button, Table, Popconfirm, message, Tag } from 'antd'
import {
  getAllDevice,
  createDevice,
  deleteDeviceById,
  updateDeviceById,
  getAllSupplier
} from '../../services/playgroundmanagerApi'
import DeviceModal from './devicemodal'
// import DeviceTypeModal from "./devicetypemodal";

const DeviceManagement = () => {
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
        return `${price.toLocaleString()} VND` // Định dạng giá tiền với dấu phẩy
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
      render: (
        status // Use render to display the Tag component
      ) => (
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
  }, [deviceList])

  const fetchDeviceList = async () => {
    const tmpDeviceList = await getAllDevice()
    const suppliersList = await getAllSupplier() // Lấy danh sách nhà cung cấp

    if (tmpDeviceList.length === 0) {
      //console.log("No devices found");
      return
    }

    // Ánh xạ supplierId sang tên nhà cung cấp
    const supplierMap = suppliersList.reduce((map, supplier) => {
      // console.log(supplier.name);

      map[supplier._id] = supplier.name
      return map
    }, {})

    const devicesWithSupplierName = tmpDeviceList.map((device) => ({
      ...device,
      supplierName: supplierMap[device.supplierId] || 'N/A' // Gán tên nhà cung cấp hoặc "N/A" nếu không tìm thấy
    }))

    setDeviceList(devicesWithSupplierName)
  }

  const handleCreateDevice = () => {
    setEditingDevice(null) // Chế độ thêm mới
    setIsModalVisible(true)
  }

  const handleEditDevice = (device) => {
    setEditingDevice(device) // Chế độ chỉnh sửa
    setIsModalVisible(true)
  }

  const handleDeleteDevice = async (id) => {
    await deleteDeviceById(id)
    setDeviceList(deviceList.filter((device) => device.id !== id))
    message.success('Device deleted successfully!')
  }

  const handleSubmitDevice = async (device) => {
    if (editingDevice) {
      // Chỉnh sửa thiết bị
      await updateDeviceById(editingDevice._id, device)
      fetchDeviceList()
      message.success('Device updated successfully!')
    } else {
      // Thêm mới thiết bị
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
        rowKey='id'
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

export default DeviceManagement
