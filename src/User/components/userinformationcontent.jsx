import { useEffect, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Form, Input, Select, Button, message } from 'antd'
import '../css/information.css'
import { updateUserbyId } from '@/services/adminApi'

const UserInformationContent = () => {
  const auth = useAuth()
  const user = auth?.user || {}
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()
  const [editingData, setEditingData] = useState(null)

  useEffect(() => {
    setLoading(false)
    // Initialize form with user data when component mounts
    if (user) {
      form.setFieldsValue({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        cardType: user?.cardType || 'Silver',
        address: user?.address || ''
      })
    }
  }, [user, form])

  const calculateDiscount = (cardType) => {
    switch (cardType) {
      case 'Platinum':
        return 0.8 // 20% discount
      case 'Gold':
        return 0.9 // 10% discount
      case 'Silver':
        return 0.95 // 5% discount
      default:
        return 1 // No discount
    }
  }

  const getDiscountPercentage = (cardType) => {
    const discountMultiplier = calculateDiscount(cardType)
    return Math.round((1 - discountMultiplier) * 100)
  }

const formatISOTime = (time) => {
  return new Date(time).toLocaleDateString({
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

  const getMembershipColor = (tier) => {
    if (tier === 'Gold') return '#FFD700'
    if (tier === 'Platinum') return '#E5E4E2'
    return '#C0C0C0' // Silver
  }

  const getMembershipBgColor = (tier) => {
    if (tier === 'Gold') return '#FFF8DC'
    if (tier === 'Platinum') return '#F0F8FF'
    return '#F5F5F5' // Silver
  }

  const handleEdit = () => {
    setEditingData(user)
    setIsEditing(true)
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const id = user._id
      console.log('Save user info:', values)
      
      await updateUserbyId(values, id)
      message.success('Thông tin đã được cập nhật!')
      setIsEditing(false)
      // Update auth context with new user data
      auth.updateUser({ ...user, ...values })
    } catch (error) {
      console.error('Validation error:', error)
      if (error.response?.status === 400) {
        const errorMsg = error.response.data?.message || 'Validation failed'
        message.error(errorMsg)
      } else {
        message.error('Vui lòng kiểm tra lại thông tin!')
      }
    }
  }

  const handleCancel = () => {
    form.setFieldsValue({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phoneNumber: user?.phoneNumber || '',
    //   cardType: user?.cardType || 'Silver',
      address: user?.address || ''
    })
    setIsEditing(false)
  }

  const handleCardTypeChange = (value) => {
    // Update discount when cardType changes
    form.setFieldsValue({ cardType: value })
  }

  if (loading) {
    return <div className="info-loading">Đang tải thông tin...</div>
  }

  return (
    <div className="user-information-wrapper">
      {/* Header Banner */}
      <div className="info-header-banner">
        <div className="info-header-content">
          <h1>Thông tin Tài khoản</h1>
          <p>Quản lý thông tin cá nhân của bạn</p>
        </div>
      </div>

      <div className="info-container">
        {/* Profile Card */}
        <div className="info-card profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                <i className="fas fa-user"></i>
              </div>
            </div>
            <div className="profile-info">
              <h2 className="user-fullname">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user?.name || 'Khách'}
              </h2>
              <p className="user-id">ID: {user?._id?.substring(0, 8) || 'N/A'}</p>
              <div
                className="membership-badge"
                style={{
                  backgroundColor: getMembershipBgColor(user?.cardType || 'Silver'),
                  borderColor: getMembershipColor(user?.cardType || 'Silver')
                }}
              >
                <span
                  className="badge-dot"
                  style={{ backgroundColor: getMembershipColor(user?.cardType || 'Silver') }}
                ></span>
                <span className="badge-text">{user?.cardType || 'Silver'}</span>
              </div>
              {!isEditing && (
                <Button 
                  type="primary" 
                  onClick={handleEdit}
                  style={{ marginTop: '12px', marginLeft: '16px' }}
                  className="edit-profile-btn"
                >
                  <i className="fas fa-edit"></i> Chỉnh sửa
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form - Only show when isEditing */}
        {isEditing && (
          <div className="info-card edit-form-card">
            <h3 className="card-title">
              <i className="fas fa-edit"></i> Chỉnh sửa Thông tin
            </h3>
            <Form form={form} layout="vertical">
              <div className="edit-form-row">
                <Form.Item label="Tên" name="firstName" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
                  <Input placeholder="Nhập tên" />
                </Form.Item>
                <Form.Item label="Họ" name="lastName" rules={[{ required: true, message: 'Vui lòng nhập họ!' }]}>
                  <Input placeholder="Nhập họ" />
                </Form.Item>
              </div>
              <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
                <Input placeholder="Nhập email" />
              </Form.Item>
              <Form.Item label="Số điện thoại" name="phoneNumber">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              {/* <Form.Item label="Loại Hội viên" name="cardType" rules={[{ required: true }]}>
                <Select onChange={handleCardTypeChange}>
                  <Select.Option value="Silver">Silver (5% discount)</Select.Option>
                  <Select.Option value="Gold">Gold (10% discount)</Select.Option>
                  <Select.Option value="Platinum">Platinum (20% discount)</Select.Option>
                </Select>
              </Form.Item> */}
              <Form.Item label="Địa chỉ" name="address">
                <Input.TextArea rows={3} placeholder="Nhập địa chỉ" />
              </Form.Item>
              <div className="edit-form-actions">
                <Button type="primary" onClick={handleSave}>
                  Lưu
                </Button>
                <Button onClick={handleCancel}>
                  Hủy
                </Button>
              </div>
            </Form>
          </div>
        )}

        {/* Account Details */}
        <div className="info-card account-details-card">
          <h3 className="card-title">
            <i className="fas fa-envelope"></i> Thông tin Tài khoản
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Email</label>
              <p className="info-value">{user?.email || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Số điện thoại</label>
              <p className="info-value">{user?.phoneNumber || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Tên đăng nhập</label>
              <p className="info-value">{user?.username || 'N/A'}</p>
            </div>
            <div className="info-item">
              <label>Vai trò</label>
              <p className="info-value">{user?.role || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Membership Info */}
        <div className="info-card membership-card">
          <h3 className="card-title">
            <i className="fas fa-star"></i> Thông tin Hội viên
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Loại Hội viên</label>
              <p className="info-value">{user?.cardType || 'Silver'}</p>
            </div>
            <div className="info-item">
              <label>Điểm Thưởng</label>
              <p className="info-value loyalty-points">{user?.loyaltyPoints || 0} điểm</p>
            </div>
            <div className="info-item">
              <label>Chiết khấu</label>
              <p className="info-value">
                {getDiscountPercentage(user?.cardType || 'Silver')}%
              </p>
            </div>
            <div className="info-item">
              <label>Trạng thái</label>
              <p className="info-value status-active">Hoạt động</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        {(user?.address || user?.address) && (
          <div className="info-card additional-card">
            <h3 className="card-title">
              <i className="fas fa-map-marker-alt"></i> Thông tin Bổ sung
            </h3>
            <div className="info-grid">
              {user?.address && (
                <div className="info-item full-width">
                  <label>Địa chỉ</label>
                  <p className="info-value">{user.address}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Account Activity */}
        <div className="info-card activity-card">
          <h3 className="card-title">
            <i className="fas fa-history"></i> Hoạt động Tài khoản
          </h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Ngày tạo tài khoản</label>
              <p className="info-value">{formatISOTime(user?.createdAt)}</p>
            </div>
            <div className="info-item">
              <label>Cập nhật lần cuối</label>
              <p className="info-value">{formatISOTime(user?.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="info-stats-summary">
          <div className="stat-box">
            <div className="stat-icon points">
              <i className="fas fa-coins"></i>
            </div>
            <div className="stat-content">
              <p className="stat-value">{user?.loyaltyPoints || 0}</p>
              <p className="stat-label">Điểm Thưởng</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon discount">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="stat-content">
              <p className="stat-value">{getDiscountPercentage(user?.cardType || 'Silver')}%</p>
              <p className="stat-label">Chiết khấu</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon membership">
              <i className="fas fa-crown"></i>
            </div>
            <div className="stat-content">
              <p className="stat-value">{user?.cardType || 'Silver'}</p>
              <p className="stat-label">Hạng Hội viên</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserInformationContent
