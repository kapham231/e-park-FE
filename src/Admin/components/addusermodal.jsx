import React, { useState } from 'react'
import { Modal, Form, Input, Select, DatePicker, message, Space, Button } from 'antd'
import dayjs from 'dayjs'
import { addUserWithRole, updateUserbyId } from '../../services/adminApi'

const { Option } = Select

const AddUserModal = ({ isModalOpen, onClose, onAddUser, onEditUser, editingUser }) => {
  const [form] = Form.useForm()
  const [changedFields, setChangedFields] = useState({})
  React.useEffect(() => {
    if (editingUser) {
      editingUser = {
        ...editingUser,
        dateOfBirth: dayjs(editingUser.dateOfBirth),
        role: editingUser.__t
      }
      form.setFieldsValue(editingUser)
    } else {
      form.resetFields()
    }
  }, [editingUser])

  // Helper function to convert field names to labels
  function fieldNameToLabel(fieldName) {
    const labels = {
      email: 'Email address',
      phoneNumber: 'Phone number',
      username: 'Username'
      // Add other field mappings as needed
    }
    return labels[fieldName] || fieldName
  }

  const handleFieldChange = (changedValues) => {
    const field = Object.keys(changedValues)[0]
    if (changedValues[field] !== editingUser[field]) {
      setChangedFields((pre) => ({
        ...pre,
        [field]: changedValues[field]
      }))
    } else {
      const { [field]: _, ...rest } = changedFields
      setChangedFields(rest)
    }
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingUser) {
        if (Object.keys(changedFields).length > 0) {
          await updateUserbyId(changedFields, editingUser._id)
          onEditUser({ ...editingUser, ...changedFields }) // Gửi user đã chỉnh sửa
        } else {
          onEditUser()
        }
      } else {
        await addUserWithRole(values)
        onAddUser(values) // Gửi list user mới
      }

      form.resetFields()
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMsg = error.response.data?.message || 'Validation failed'

        if (errorMsg.startsWith('Customer validation failed:')) {
          const errorsString = errorMsg.replace('Customer validation failed:', '').trim()
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
          // Extract the duplicate field and value
          const matches = errorMsg.match(/index: (\w+)_\d+ dup key: { (.+): "(.+)" }/)

          if (matches) {
            const fieldName = matches[1] // "email"
            const duplicateValue = matches[3] // "1231as@gmail.com"

            // User-friendly message
            message.error(
              `${fieldNameToLabel(fieldName)} "${duplicateValue}" is already registered. ` +
                'Please use a different value.'
            )

            // Highlight the problematic field in the form
            form.setFields([
              {
                name: [fieldName],
                errors: [`This ${fieldName} is already in use`]
              }
            ])
          } else {
            // Fallback for unexpected format
            message.error('This value is already in use. Please try another one.')
          }
        }

        if (errorMsg.includes('Phone number must be a valid Vietnamese phone number')) {
          message.error('Phone number must be a valid Vietnamese phone number!')
          form.setFields([
            {
              name: ['phoneNumber'],
              errors: ['Phone number must be a valid Vietnamese phone number']
            }
          ])
        }

        return
      }

      if (error.response?.status === 500) {
        const errorMsg = error.response.data?.message || 'Validation failed:'
        if (errorMsg.startsWith('Validation failed:')) {
          const errorsString = errorMsg.replace('Validation failed:', '').trim()
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
          }
        }

        if (errorMsg.includes('E11000 duplicate key error')) {
          // Extract the duplicate field and value
          const matches = errorMsg.match(/index: (\w+)_\d+ dup key: { (.+): "(.+)" }/)

          if (matches) {
            const fieldName = matches[1] // "email"
            const duplicateValue = matches[3] // "1231as@gmail.com"

            // User-friendly message
            message.error(
              `${fieldNameToLabel(fieldName)} "${duplicateValue}" is already registered. ` +
                'Please use a different value.'
            )

            // Highlight the problematic field in the form
            form.setFields([
              {
                name: [fieldName],
                errors: [`This ${fieldName} is already in use`]
              }
            ])
          } else {
            // Fallback for unexpected format
            message.error('This value is already in use. Please try another one.')
          }
        }

        return
      }

      message.error('Please fill in the form correctly!')
      console.log(error)
    }
  }

  return (
    <>
      <Modal
        title={editingUser ? 'Edit User' : 'Add User'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => {
          setChangedFields({})
          onClose()
        }}
        footer={(_, { CancelBtn }) => (
          <Space>
            <CancelBtn />
            <Button type='primary' onClick={handleSave} disabled={editingUser && !Object.keys(changedFields).length}>
              {editingUser ? 'Edit' : 'Add'}
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
        <Form form={form} layout='vertical' name='user_form' onValuesChange={handleFieldChange}>
          <Form.Item
            label='First Name'
            name='firstName'
            rules={[{ required: true, message: 'Please enter first name!' }]}
          >
            <Input
              placeholder='Enter First Name'
              onBlur={(e) => {
                const value = e.target.value
                const sanitizedValue = value.replace(/\s{2,}/g, ' ').trim() // Loại bỏ khoảng trắng thừa
                form.setFieldValue('firstName', sanitizedValue) // Cập nhật giá trị vào form
              }}
            />
          </Form.Item>
          <Form.Item label='Last Name' name='lastName' rules={[{ required: true, message: 'Please enter last name!' }]}>
            <Input
              placeholder='Enter Last Name'
              onBlur={(e) => {
                const value = e.target.value
                const sanitizedValue = value.replace(/\s{2,}/g, ' ').trim() // Loại bỏ khoảng trắng thừa
                form.setFieldValue('lastName', sanitizedValue) // Cập nhật giá trị vào form
              }}
            />
          </Form.Item>
          <Form.Item
            label='Username'
            name='username'
            rules={[{ required: true, message: 'Please enter the username!' }]}
          >
            <Input placeholder='Enter username' />
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
          <Form.Item
            label='Phone Number'
            name='phoneNumber'
            rules={[{ required: true, message: 'Please enter the phone number!' }]}
          >
            <Input placeholder='Enter phone number' />
          </Form.Item>
          <Form.Item label='Address' name='address' rules={[{ required: true, message: 'Please enter the address!' }]}>
            <Input placeholder='Enter address' />
          </Form.Item>
          <Form.Item
            label='Date of Birth'
            name='dateOfBirth'
            rules={[{ type: 'object', required: true, message: 'Please enter the date of birth!' }]}
          >
            <DatePicker
              placeholder='Select date of birth'
              style={{ width: '100%' }}
              format='YYYY-MM-DD'
              disabledDate={(current) => current && current > dayjs().endOf('day')} // Ngăn chọn ngày trong tương lai
            />
          </Form.Item>
          <Form.Item label='Gender' name='gender' rules={[{ required: true, message: 'Please select a gender!' }]}>
            <Select placeholder='Select a gender'>
              <Option value='male'>Male</Option>
              <Option value='female'>Female</Option>
              <Option value='other'>Other</Option>
            </Select>
          </Form.Item>
          <Form.Item label='Role' name='role' rules={[{ required: true, message: 'Please select a role!' }]}>
            <Select placeholder='Select a role' disabled={editingUser}>
              <Option value='PlaygroundManager'>Manager</Option>
              <Option value='Staff'>Staff</Option>
              <Option value='Customer'>Customer</Option>
            </Select>
          </Form.Item>

          {/* Hiển thị trường Position chỉ khi role là Manager hoặc Staff */}
          <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.role !== currentValues.role}>
            {({ getFieldValue }) =>
              getFieldValue('role') === 'PlaygroundManager' ? (
                <Form.Item
                  label='Position'
                  name='position'
                  rules={[{ required: true, message: 'Please enter the position!' }]}
                >
                  <Input placeholder='Enter position' />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          {/* Hiển thị trường Password và Confirm Password chỉ khi Add User */}
          {!editingUser && (
            <>
              <Form.Item
                label='Password'
                name='password'
                rules={[
                  { required: true, message: 'Please enter the password!' },
                  { min: 6, message: 'Password must be at least 6 characters long!' }
                ]}
              >
                <Input.Password placeholder='Enter password' />
              </Form.Item>
              <Form.Item
                label='Confirm Password'
                name='confirmPassword'
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm the password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('The two passwords do not match!'))
                    }
                  })
                ]}
              >
                <Input.Password placeholder='Confirm password' />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </>
  )
}
export default AddUserModal
