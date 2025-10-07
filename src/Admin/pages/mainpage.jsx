import React from 'react'

import Header from '@/components/header'
import Sidebar from '@/components/sidebar'

const AdminMainPage = () => {
  return (
    <>
      <Header role='admin' />

      <div style={{ display: 'flex' }}>
        <Sidebar role={'admin'} />
      </div>
    </>
  )
}

export default AdminMainPage
