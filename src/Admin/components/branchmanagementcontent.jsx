import React, { useState, useEffect } from 'react'
import { Table, Button, Space, message, Popconfirm, Input } from 'antd'
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons'
import AddBranchModal from './addbranchmodal'
import BranchDetailModal from './branchdetailmodal'
import { getAllBranch, deleteBranch, updateBranchById } from '../../services/adminApi'
import '../css/usermanagement.css'

const BranchManagementContent = () => {
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState(null)

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    setLoading(true)
    try {
      const response = await getAllBranch()
      // console.log('API Response:', response)
      // The API function already returns response.data, so response is the data array
      const branchesData = response || []
      // console.log('Branches data:', branchesData)
      setBranches(Array.isArray(branchesData) ? branchesData : [])
    } catch (error) {
      console.error('Error fetching branches:', error)
      message.error('Failed to fetch branches')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBranch = (newBranch) => {
    setBranches([...branches, newBranch])
  }

  const handleEditBranch = async (updatedBranch) => {
    try {
      if (updatedBranch && updatedBranch._id) {
        setBranches(branches.map(branch => branch._id === updatedBranch._id ? updatedBranch : branch))
        await fetchBranches()
        message.success('Branch updated successfully!')   
  }
      handleModalClose()
      
    } catch (error) {
      console.error('Error updating branch:', error)
      message.error('Failed to update branch')
    }
  }

    const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingBranch(null)
  }

  const handleDeleteBranch = async (branchId) => {
    try {
      await deleteBranch(branchId)
      setBranches(branches.filter(branch => branch._id !== branchId))
      message.success('Branch deleted successfully')
    } catch (error) {
      console.error('Error deleting branch:', error)
      message.error('Failed to delete branch')
    }
  }

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchText.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchText.toLowerCase()) ||
    branch.email.toLowerCase().includes(searchText.toLowerCase())
  )

  const columns = [
    {
      title: 'Branch Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address'
    },
    {
      title: 'Manager',
      dataIndex: 'managerId',
      key: 'managerId',
      render: (_, record) => {
        const manager = record.managerId
        return manager ? `${manager.firstName} ${manager.lastName}` : 'N/A'
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size='middle'>
          <Button
            className='view-button' onClick={() => {
              setSelectedBranch(record)
              setIsDetailModalOpen(true)
            }}
          >
            View
          </Button>
          <Button
            className='edit-button' onClick={() => {
              setEditingBranch(record)
              setIsModalOpen(true)
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title='Delete the branch'
            description='Are you sure to delete this branch?'
            onConfirm={() => handleDeleteBranch(record._id)}
            okText='Yes'
            cancelText='No'
          >
            <Button className="delete-button">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const handleRowClick = (record) => {
    setSelectedBranch(record)
    setIsDetailModalOpen(true)
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Input
          placeholder='Search branches...'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button
          type='primary'
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingBranch(null)
            setIsModalOpen(true)
          }}
          className='AD-add-branch-button'
        >
          Add Branch
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredBranches}
        rowKey='_id'
        loading={loading}
        // onRow={(record) => ({
        //   onClick: () => handleRowClick(record)
        // })}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} branches`
        }}
      />

      <AddBranchModal
        isModalOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingBranch(null)
        }}
        onAddBranch={handleAddBranch}
        editingBranch={editingBranch}
        onEditBranch={handleEditBranch}
      />

      <BranchDetailModal
        isModalOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedBranch(null)
        }}
        branch={selectedBranch}
      />
    </div>
  )
}

export default BranchManagementContent
