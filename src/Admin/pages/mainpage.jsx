import React from 'react'

import Header from '@/components/header'
import Sidebar from '@/components/sidebar'

const AdminMainPage = () => {
  return (
    <>
      <Header role='admin' />
      <Sidebar role={'admin'} />
    </>
  )
}

export default AdminMainPage
