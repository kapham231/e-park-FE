import { useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Card, DatePicker, Form, Input, InputNumber, Typography } from 'antd'
import { UserOutlined, PhoneOutlined, MailOutlined, UsergroupAddOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import moment from 'moment'
import dayjs from 'dayjs'
import { getAllTicket } from '../../services/adminApi'
import '../css/userregister.css'
import { useAuth } from '@/contexts/authContext'

const { Text } = Typography

const UserRegister = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [ticket, setTicket] = useState(null) // Chỉ có 1 loại vé Normal hoặc Weekend
  const [selectedTicket, setSelectedTicket] = useState(null)

  const auth = useAuth()

  const user = auth.user || {}

  console.log(user)

  useEffect(() => {
    getAllTicket().then((tickets) => {
      const normalTicket = tickets.find((t) => t.ticketType === 'Normal')
      const weekendTicket = tickets.find((t) => t.ticketType === 'Weekend')

      if (normalTicket && weekendTicket) {
        setTicket({ normal: normalTicket, weekend: weekendTicket })
      }

      // Đặt thông tin mặc định cho form
      form.setFieldsValue({
        name: `${user.firstName || ''} ${user.lastName || ''}`,
        phone: user.phoneNumber || '',
        email: user.email || ''
      })
    })
  }, [form])

  const handleDateChange = (date) => {
    if (!date || !ticket) {
      setSelectedTicket(null)
      return
    }
    const dayOfWeek = date.day() // 0 = Sunday, 6 = Saturday
    setSelectedTicket(dayOfWeek === 0 || dayOfWeek === 6 ? ticket.weekend : ticket.normal)
    form.setFieldsValue({ quantity: 0, bonus: 0 })
  }

  // console.log(selectedTicket);

  const handleRegister = () => {
    form.validateFields().then((values) => {
      console.log('Form values:', values)

      if (!selectedTicket) {
        alert('Please select a date to book a ticket.')
        return
      }

      const bookingDate = values.bookingDate
        ? dayjs(values.bookingDate).toISOString() // Chuyển thành chuỗi ISO
        : null

      console.log('Formatted bookingDate:', bookingDate)

      const order = {
        ...values,
        bookingDate,
        ticketId: selectedTicket._id,
        customerId: user._id,
        ticketType: selectedTicket.ticketType,
        ticketPrice: selectedTicket.price,
        quantity: values.quantity || 0,
        bonus: values.bonus || 0,
        bonusPrice: selectedTicket.bonusPrice
      }

      if (order.quantity === 0) {
        alert('Please select at least one ticket.')
        return
      }

      navigate('payment', { state: { order } })
    })
  }

  return (
    <div className='us-register-container'>
      <div
        style={{
          padding: '20px',
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        <Card
          title={<h2>📝 Order Information</h2>}
          style={{ textAlign: 'left', marginTop: '20px', marginBottom: '20px' }}
        >
          <Form layout='vertical' form={form}>
            <Form.Item label='Name' name='name' rules={[{ required: true, message: 'Please enter your name' }]}>
              <Input prefix={<UserOutlined />} placeholder='Enter your name' />
            </Form.Item>

            <Form.Item
              label='Phone'
              name='phone'
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input prefix={<PhoneOutlined />} placeholder='Enter your phone number' />
            </Form.Item>

            <Form.Item label='Email' name='email' rules={[{ required: true, message: 'Please enter your email' }]}>
              <Input prefix={<MailOutlined />} placeholder='Enter your email' />
            </Form.Item>

            <Form.Item
              label='Select Date'
              name='bookingDate'
              rules={[{ required: true, message: 'Please select a date to book a ticket' }]}
            >
              <DatePicker
                onChange={handleDateChange}
                style={{ width: '100%' }}
                disabledDate={(current) => {
                  // Disable all dates in the past
                  return current && current < moment().startOf('day')
                }}
              />
            </Form.Item>

            {selectedTicket && (
              <>
                <h5>🎟️ Select Ticket</h5>
                <Form.Item
                  label={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong>{selectedTicket.ticketType}</Text>
                      <Text
                        style={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          color: '#3B71CA',
                          backgroundColor: '#EAF2FF',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          marginLeft: '10px'
                        }}
                      >
                        {selectedTicket.price.toLocaleString()} VND
                      </Text>
                    </div>
                  }
                  name='quantity'
                  rules={[{ required: true, message: 'Please enter quantity' }]}
                >
                  <InputNumber
                    min={1}
                    placeholder='Enter quantity'
                    style={{ width: '100%' }}
                    onChange={(value) => form.setFieldsValue({ quantity: value })}
                  />
                  <Alert
                    message={'One ticket includes only one child and one parent'}
                    type='info'
                    showIcon
                    style={{ marginTop: '5px' }}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text>Extra Parent</Text>
                      <Text
                        style={{
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          color: '#3B71CA',
                          backgroundColor: '#EAF2FF',
                          padding: '5px 10px',
                          borderRadius: '8px',
                          marginLeft: '10px'
                        }}
                      >
                        {selectedTicket.bonus.toLocaleString()} VND
                      </Text>
                    </div>
                  }
                  name='bonus'
                >
                  <InputNumber
                    prefix={<UsergroupAddOutlined />}
                    min={0}
                    max={5}
                    placeholder='Enter quantity'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button type='default' danger onClick={() => navigate(-1)}>
                Back to Event
              </Button>
              <Button style={{ backgroundColor: '#3B71CA', color: 'white' }} onClick={handleRegister}>
                Checkout
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default UserRegister
