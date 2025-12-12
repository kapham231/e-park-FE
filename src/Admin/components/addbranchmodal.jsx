import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, message, Space, Button, Select } from 'antd'
import { createBranch, getManagerToAddBranch, getUserNameById, updateBranchById } from '../../services/adminApi'

const AddBranchModal = ({ isModalOpen, onClose, onAddBranch, onEditBranch, editingBranch }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [manager, setManager] = useState([])
  const [changedFields, setChangedFields] = useState({})
  // get manager list for branch assignment
    React.useEffect(() => {
      if (editingBranch) {
        form.setFieldsValue(editingBranch)
      } else {
        form.resetFields()
      }
    }, [editingBranch])
    
  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const data = await getManagerToAddBranch()
        setManager(data)
      } catch (error) {
        console.error('Error fetching managers:', error)
      }
  } 
  if(isModalOpen){
    fetchManagers()
  }
  },[isModalOpen] )

  const handleFieldChange = (changedValues) => {
    const field = Object.keys(changedValues)[0]
    if (!editingBranch || changedValues[field] !== editingBranch[field]) {
      setChangedFields((pre) => ({
        ...pre,
        [field]: changedValues[field]
      }))
    } else {
      const { [field]: _, ...rest } = changedFields
      setChangedFields(rest)
    }
  }

  // useEffect(() => {
  //   const fetchManagersForEdit = async () => {
  //     try {
  //       if (editingBranch && editingBranch.managerId) {
  //         const currentManager = await getUserNameById(editingBranch.managerId)
  //         // Không thay đổi manager state, chỉ hiển thị thông tin manager hiện tại
  //         form.setFieldValue('managerId', `${currentManager.firstName} ${currentManager.lastName} (${currentManager.username})`)
  //       }
  //     }
  //     catch (error) {
  //       console.error('Error fetching current manager:', error)
  //     }
  //   }
  //   if (editingBranch) {
  //     fetchManagersForEdit()
  //   }
  // }, [editingBranch, form])


  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingBranch) {
        if (Object.keys(changedFields).length > 0) {
          await updateBranchById(changedFields, editingBranch._id)
          onEditBranch({ ...editingBranch, ...changedFields }) // Gửi branch đã chỉnh sửa
        } else {
          onEditBranch()
        }
      } else {
      await createBranch(values)
      onAddBranch(values)
      }
      form.resetFields()
      onClose()
      message.success('Branch added successfully!')
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMsg = error.response.data?.message || 'Validation failed'

        if (errorMsg.startsWith('Branch validation failed:')) {
          const errorsString = errorMsg.replace('Branch validation failed:', '').trim()
          const errorPairs = errorsString.split(', ')

          const fieldErrors = errorPairs.reduce((acc, pair) => {
            const [field, ...messageParts] = pair.split(': ')
            if (field && messageParts.length) {
              acc.push({
                name: [field.trim()],
                errors: [messageParts.join(': ').trim()]
              })
            }
            return acc
          }, [])

          if (fieldErrors.length) {
            form.setFields(fieldErrors)
            message.error(fieldErrors[0].errors)
          }
        }

        if (errorMsg.includes('E11000 duplicate key error')) {
          const matches = errorMsg.match(/index: (\w+)_\d+ dup key: { (.+): "(.+)" }/)

          if (matches) {
            const fieldName = matches[1]
            const duplicateValue = matches[3]

            message.error(`${fieldName} "${duplicateValue}" already exists. Please use a different value.`)

            form.setFields([
              {
                name: [fieldName],
                errors: [`This ${fieldName} is already in use`]
              }
            ])
          } else {
            message.error('This value is already in use. Please try another one.')
          }
        }

        return
      }

      message.error('Please fill in the form correctly!')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title={editingBranch ? 'Edit Branch' : 'Add Branch'}
      open={isModalOpen}
      onOk={handleSave}
        onCancel={() => {
          setChangedFields({})
          onClose()
        }}
      footer={(_, { CancelBtn }) => (
        <Space>
          <CancelBtn />
          <Button type='primary' onClick={handleSave} loading={loading}>
            {editingBranch ? 'Save Changes' : 'Add Branch'}
          </Button>
        </Space>
      )}
      centered
      styles={{
        body: {
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: '24px 24px 0'
        }
      }}
    >
      <Form form={form} layout='vertical' name='branch_form' onValuesChange={handleFieldChange}>
        <Form.Item
          label='Branch Name'
          name='name'
          rules={[{ required: true, message: 'Please enter branch name!' }]}
        >
          <Input
            placeholder='Enter Branch Name'
            onBlur={(e) => {
              const value = e.target.value
              const sanitizedValue = value.replace(/\s{2,}/g, ' ').trim()
              form.setFieldValue('name', sanitizedValue)
            }}
          />
        </Form.Item>
        <Form.Item
          label='Address'
          name='address'
          rules={[{ required: true, message: 'Please enter the address!' }]}
        >
          <Input placeholder='Enter address' />
        </Form.Item>
        <Form.Item
          label='Phone Number'
          name='phoneNumber'
          rules={[{ required: true, message: 'Please enter the phone number!' }]}
        >
          <Input placeholder='Enter phone number' />
        </Form.Item>
        <Form.Item
          label='Email'
          name='email'
          rules={[
            { required: true, message: 'Please enter the email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder='Enter email' />
        </Form.Item>
        {/* Manager selection dropdown*/}
        {/* nếu là chỉnh sửa thì không cho đổi manager*/}
        {!editingBranch && (
        <>
        <Form.Item
          label='Manager'
          name='managerId'
          rules={[{ required: true, message: 'Please select a manager!' }]}
        >
          <Select placeholder='Select a manager'>
            {manager.map((mgr) => (
              <Select.Option key={mgr._id} value={mgr._id}>
                {mgr.firstName} {mgr.lastName} ({mgr.username})
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        </>
        )}
      </Form>
    </Modal>
  )
}

export default AddBranchModal
