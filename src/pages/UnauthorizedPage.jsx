import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { getHomepageByRole } from '../config/roles'

const UnauthorizedPage = () => {
  const { user, isAuthenticated } = useAuth()

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
      <div className='error-container'>
        <h1>403</h1>
        <h2>Truy cập bị từ chối</h2>
        <p>Bạn không có quyền truy cập trang này.</p>

        {isAuthenticated ? (
          <>
            <p className='user-info'>
              Bạn đang đăng nhập với vai trò: <strong>{user.role || 'Admin'}</strong>
            </p>
            <Link to={getHomepageByRole(user.role)} className='btn btn-primary'>
              Quay về trang chủ
            </Link>
          </>
        ) : (
          <Link to='/login' className='btn btn-primary'>
            Đăng nhập
          </Link>
        )}
      </div>
    </div>
  )
}

export default UnauthorizedPage
