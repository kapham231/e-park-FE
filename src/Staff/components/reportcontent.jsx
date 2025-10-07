import React, { useEffect, useState } from 'react'
import { Button, Col, Empty, message, Modal, Row, Table, Tag, Typography } from 'antd'
import Search from 'antd/es/input/Search'
import { SearchOutlined } from '@ant-design/icons'
import { getAllDevice, getAllSupplier, updateDeviceById } from '../../services/playgroundmanagerApi'
import useCheckMobile from '../../hooks/useCheckMobile'

const { Title } = Typography

const ReportErrorContent = () => {
  const useMobile = useCheckMobile()
  const [searchTerm, setSearchTerm] = useState('')
  const [equipment, setEquipment] = useState([])
  const [filteredEquipment, setFilteredEquipment] = useState([])
  const [loading, setLoading] = useState(false) // Optional: for async data loading

  // Simulate data fetching (optional, replace with actual API call)
  useEffect(() => {
    setLoading(true)
    fetchEquipments().finally(() => {
      setLoading(false)
    })
  }, [])

  // Filter logic when search term changes
  useEffect(() => {
    setLoading(true) // Show loading indicator during filtering large lists
    let normalizedSearchTerm = formatTerm(searchTerm.trim())
    if (!normalizedSearchTerm) {
      setFilteredEquipment(equipment) // Show all if search is empty
    } else {
      const filtered = equipment.filter((item) => {
        // Normalize the item's name and supplier for comparison
        let normalizedCode = formatTerm(item.code)
        let normalizedSupplier = formatTerm(item.supplierName)
        // Check if normalized fields include the normalized search term
        // This comparison works regardless of original accents
        if (normalizedSearchTerm.length === removeAccents(normalizedSearchTerm).length) {
          normalizedSearchTerm = removeAccents(normalizedSearchTerm)
          normalizedCode = removeAccents(normalizedCode)
          normalizedSupplier = removeAccents(normalizedSupplier)
        }
        return normalizedCode.includes(normalizedSearchTerm) || normalizedSupplier.includes(normalizedSearchTerm)
      })
      setFilteredEquipment(filtered)
    }
    // Short timeout for visual feedback
    const timer = setTimeout(() => setLoading(false), 150)
    return () => clearTimeout(timer)
  }, [searchTerm, equipment])

  const removeAccents = (str) => {
    if (!str) return ''
    return str.replace(/[\u0300-\u036f]/g, '')
  }

  const formatTerm = (term) => {
    if (!term) return ''
    return term.trim().toLowerCase().normalize('NFD')
  }

  const fetchEquipments = async () => {
    const tmpEquipmentList = await getAllDevice()
    const suppliersList = await getAllSupplier()

    if (tmpEquipmentList.length === 0) {
      console.log('No devices found')
      return
    }

    const supplierMap = suppliersList.reduce((map, supplier) => {
      console.log(supplier.name)

      map[supplier._id] = supplier.name
      return map
    }, {})

    const devicesWithSupplierName = tmpEquipmentList.map((device) => ({
      ...device,
      supplierName: supplierMap[device.supplierId] || 'N/A' // Gán tên nhà cung cấp hoặc "N/A" nếu không tìm thấy
    }))

    setEquipment(devicesWithSupplierName)
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

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

  const handleReportErrorClick = async (equipmentId) => {
    await updateDeviceById(equipmentId, {
      status: 'Error'
    })
    setLoading(true)
    fetchEquipments().finally(() => {
      setLoading(false)
      message.success('Reported error successfully!')
    })
  }

  const columns = [
    {
      title: 'Device type', // Column header text
      dataIndex: 'typeName', // Key from your data object
      key: 'typeName', // Unique key for this column
      ellipsis: true // Add ellipsis (...) if text is too long
    },
    {
      title: 'Device Code',
      dataIndex: 'code',
      key: 'code',
      ellipsis: true
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 150,
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
      width: 150, // Give action a fixed width
      render: (
        _,
        record // Use render to display the Button component
      ) => (
        // '_' signifies the first argument (text) isn't needed here
        // 'record' is the data object for the current row
        <Button
          type='primary'
          danger
          disabled={record.status !== 'Available'}
          onClick={() => {
            Modal.confirm({
              title: 'Confirm',
              content: 'Are you sure to report this device?',
              onOk() {
                handleReportErrorClick(record._id)
              },
              onCancel() {
                message.error('Cancel report device!')
              }
            })
          }}
        >
          Report
        </Button>
      )
    }
  ]

  return (
    <div style={{ padding: useMobile ? 0 : 20, transition: 'all 0.3s ease-in-out' }}>
      <Title level={2} style={{ marginBottom: '24px', textAlign: 'center' }}>
        Report Error
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={18} md={12} lg={11}>
          <Search
            placeholder='Search equipment by code or supplier name...'
            allowClear
            enterButton={
              <>
                <SearchOutlined /> Search
              </>
            }
            size='large'
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            loading={loading && searchTerm}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>

      <Table
        columns={columns} // Pass the column definitions
        dataSource={filteredEquipment} // Pass the data array
        rowKey='code' // IMPORTANT: Tell the table how to uniquely identify rows
        loading={loading} // Show loading indicator on the table itself
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '15', '20', '25'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} equipments`,
          style: { marginTop: '16px', textAlign: 'right' }
        }}
        scroll={{ x: 'max-content' }}
        locale={{
          emptyText: (
            <Empty
              description={searchTerm ? `No equipment found matching "${searchTerm}"` : 'No equipment data available.'}
            />
          )
        }}
        style={{ marginTop: '20px' }}
      />
    </div>
  )
}

export default ReportErrorContent
