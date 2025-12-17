import React, { useState, useEffect } from 'react'
import { Modal, Button, Select, message } from 'antd'
import { getAllBranch, transferBranch } from '../../services/adminApi'

const { Option } = Select

const TransferBranchModal = ({ open, onClose, user, onTransfer }) => {
  const [selectedBranchId, setSelectedBranchId] = useState('')
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch branches when modal opens
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await getAllBranch()
        setBranches(Array.isArray(response) ? response : [])
      } catch (error) {
        console.error('Error fetching branches:', error)
        message.error('Failed to load branches')
      }
    }

    if (open) {
      fetchBranches()
      // Set current branch if user has one
      if (user?.branchId) {
        setSelectedBranchId(user.branchId)
      } else {
        setSelectedBranchId('')
      }
    }
  }, [open, user])

  const handleTransfer = async () => {
    if (!selectedBranchId) {
      message.error('Please select a branch')
      return
    }

    setLoading(true)
    try {
      await onTransfer(user._id, selectedBranchId)
    } catch (error) {
      console.error('Error transfering branch:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setSelectedBranchId('')
    onClose()
  }

  return (
    <Modal
      title={`Transfer Branch to ${user?.firstName} ${user?.lastName}`}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="transfer" type="primary" loading={loading} onClick={handleTransfer}>
          Transfer
        </Button>
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>Select Branch:</label>
        <Select
          placeholder="Select a branch"
          value={selectedBranchId}
          onChange={setSelectedBranchId}
          style={{ width: '100%' }}
        >
          {Array.isArray(branches) && branches.map((branch) => (
            <Option key={branch._id} value={branch._id}>
              {branch.name}
            </Option>
          ))}
        </Select>
      </div>
    </Modal>
  )
}

export default TransferBranchModal
