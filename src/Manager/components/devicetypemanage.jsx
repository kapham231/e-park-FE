import { useEffect, useState } from 'react'
import { Button, Table, Popconfirm, message } from 'antd'
import { getAllType, createType, deleteTypeById, updateTypeById } from '../../services/playgroundmanagerApi'
import DeviceTypeModal from './devicetypemodal'

const DeviceTypeManagement = () => {
  const [typeList, setTypeList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingType, setEditingType] = useState(null)

  const columns = [
    {
      title: 'Device Type',
      dataIndex: 'typeName',
      key: 'type',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => a.typeName.localeCompare(b.typeName)
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code)
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: (a, b) => a.quantity - b.quantity
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <Button type='link' onClick={() => handleEditType(record)}>
            Edit
          </Button>
          <Popconfirm
            title='Are you sure to delete this device?'
            onConfirm={() => handleDeleteType(record._id)}
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
    fetchTypeList()
  }, [])

  const fetchTypeList = async () => {
    const typeList = await getAllType()
    console.log('typeList: ', typeList)

    if (typeList.length === 0) {
      console.log('No type found')
      setTypeList([])
      return
    }

    setTypeList(typeList)
  }

  const handleCreateType = () => {
    setEditingType(null) // Chế độ thêm mới
    setIsModalVisible(true)
  }

  const handleEditType = (type) => {
    setEditingType(type) // Chế độ chỉnh sửa
    setIsModalVisible(true)
  }

  const handleDeleteType = async (id) => {
    await deleteTypeById(id)
    setTypeList(typeList.filter((type) => type.id !== id))
    message.success('Type deleted successfully!')
  }

  const handleSubmitType = async (type) => {
    if (editingType) {
      // Chỉnh sửa thiết bị
      await updateTypeById(editingType._id, type)
      fetchTypeList()
      message.success('Type updated successfully!')
    } else {
      // Thêm mới thiết bị
      await createType(type)
      fetchTypeList()
      message.success('Type added successfully!')
    }
    setIsModalVisible(false)
  }

  return (
    <div style={{ margin: '20px' }}>
      <Button style={{ backgroundColor: '#3b71ca', color: 'white', marginBottom: '16px' }} onClick={handleCreateType}>
        Add Device Type
      </Button>
      <Table columns={columns} dataSource={typeList} rowKey='id' />
      <DeviceTypeModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleSubmitType}
        initialValues={editingType}
      />
    </div>
  )
}

export default DeviceTypeManagement
