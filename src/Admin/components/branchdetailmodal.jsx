import React, { useState, useEffect } from 'react'
import { Modal, Table, Tag, message } from 'antd'
import { getUsersByBranchId } from '../../services/adminApi'

const BranchDetailModal = ({ isModalOpen, onClose, branch }) => {
  const [staffInfo, setStaffInfo] = useState([])
  const [managerInfo, setManagerInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isModalOpen && branch) {
      fetchUsersByBranch()
    }
  }, [isModalOpen, branch])

  const fetchUsersByBranch = async () => {
    if (!branch) return

    setLoading(true)
    try {
      const response = await getUsersByBranchId(branch._id)
      console.log('Users by branch:', response)
      const { staffInfo = [], managerInfo = null } = response || {}
      setStaffInfo(Array.isArray(staffInfo) ? staffInfo : [])
      setManagerInfo(managerInfo)
    } catch (error) {
      console.error('Error fetching users by branch:', error)
      message.error('Failed to fetch users for this branch')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (_, record) => `${record.firstName} ${record.lastName}`,
      sorter: (a, b) => {
        const nameA = `${a.firstName} ${a.lastName}`
        const nameB = `${b.firstName} ${b.lastName}`
        return nameA.localeCompare(nameB)
      }
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username)
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email)
    },
    {
      title: 'Role',
      dataIndex: '__t',
      key: 'role',
      render: (roleTag) => {
        let color
        switch (roleTag) {
          case 'PlaygroundManager':
            color = 'red'
            break
          case 'Staff':
            color = 'blue'
            break
          case 'Customer':
            color = 'green'
            break
          default:
            color = 'gray'
        }
        return <Tag color={color}>{roleTag}</Tag>
      }
    },
    {
      title: 'Phone Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber'
    }
  ]

  return (
    <Modal
      title={`Branch Details: ${branch?.name || 'Unknown Branch'}`}
      open={isModalOpen}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
    >
      <div style={{ marginBottom: 16 }}>
        <h3>Branch Information</h3>
        <p><strong>Name:</strong> {branch?.name}</p>
        <p><strong>Address:</strong> {branch?.address}</p>
        <p><strong>Phone:</strong> {branch?.phoneNumber}</p>
        <p><strong>Email:</strong> {branch?.email}</p>
      </div>

      <div>
        {managerInfo && (
          <div style={{ marginBottom: 16 }}>
            <h3>Manager Information</h3>
            <p><strong>Name:</strong> {managerInfo.firstName} {managerInfo.lastName}</p>
            <p><strong>Username:</strong> {managerInfo.username}</p>
            <p><strong>Email:</strong> {managerInfo.email}</p>
            <p><strong>Phone:</strong> {managerInfo.phoneNumber}</p>
            <p><strong>Position:</strong> {managerInfo.position}</p>
          </div>
        )}

        <h3>Staff ({staffInfo.length})</h3>
        <Table
          columns={columns}
          dataSource={staffInfo}
          rowKey='_id'
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} staff`
          }}
          size="small"
        />
      </div>
    </Modal>
  )
}

export default BranchDetailModal
