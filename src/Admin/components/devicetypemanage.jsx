import { useEffect, useState } from 'react'
import { Button, Table, Popconfirm, message, Input } from 'antd'
import { getAllType, createType, deleteTypeById, updateTypeById } from '../../services/adminApi'
import DeviceTypeModal from './devicetypemodal'

const DeviceTypeManagement = () => {
  const [typeList, setTypeList] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingType, setEditingType] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [loading, setLoading] = useState(false)

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
    //     {
    //   title: 'Action',
    //   key: 'action',
    //   align: 'center',
    //   render: (_, record) => (
    //     <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
    //       <Button type='link' onClick={() => handleEditProduct(record)}>
    //         Edit
    //       </Button>
    //       <Popconfirm
    //         title='Are you sure to delete this product?'
    //         onConfirm={() => handleDeleteProduct(record._id)}
    //         okText='Yes'
    //         cancelText='No'
    //       >
    //         <Button type='link' danger>
    //           Delete
    //         </Button>
    //       </Popconfirm>
    //     </div>
    //   )
    // },
    {
      title: 'Branch',
      dataIndex: 'branchname',
      key: 'branch',
      render: (text) => text || 'N/A',
      sorter: (a, b) => (a.branchname || '').localeCompare(b.branchname || '')
    }
  ]

  useEffect(() => {
    fetchTypeList()
  }, [])

  const fetchTypeList = async () => {
    try {
      const typeList = await getAllType()
      console.log('typeList: ', typeList)

      if (typeList.length === 0) {
        console.log('No type found')
        setTypeList([])
        return
      }

      // Fetch branch information for each type
      const typesWithBranch = await Promise.all(
        typeList.map(async (type) => {
          try {
            // Assuming there's a getBranch API function, or we need to create one
            // For now, we'll use a placeholder or check if branch info is already in the response
            if (type.branchId) {
              // You might need to add a getBranch function to playgroundmanagerApi.jsx
              // const branchResponse = await getBranch(type.branchId)
              // return { ...type, branch: branchResponse }

              // For now, return type as is - branch info needs to be added to API response
              return type
            }
            return type
          } catch (error) {
            console.error('Error fetching branch for type:', type._id, error)
            return type
          }
        })
      )

      setTypeList(typesWithBranch)
    } catch (error) {
      console.error('Error fetching types:', error)
      setTypeList([])
    }
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
      await updateTypeById(editingType.id, type)
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

  const filteredTypes = typeList.filter(type =>
    (type.typeName || '').toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div style={{ margin: '20px' }}>
      {/* <Button style={{ backgroundColor: '#3b71ca', color: 'white', marginBottom: '16px' }} onClick={handleCreateType}>
        Add Device Type
      </Button> */}
      <Input
          placeholder='Search device type...'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
       />
      <Table 
        columns={columns} 
        dataSource={filteredTypes} 
        loading={loading} rowKey='id'         
        scroll={{ x: 'max-content' }}
        style={{ marginTop: '16px' }}
      />
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
