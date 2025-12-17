import React, { useEffect, useState } from 'react'
import AddTicketModal from './addticketmodal'
import { Table, Button, message, Popconfirm, Modal, InputNumber } from 'antd'
import { createTicket, deleteTicketbyId, getAllTicket, updateTicketbyId, createTicketForNewMember } from '../../services/adminApi'
import { getInvoice, updateInvoice } from '../../services/userApi'
import { jsPDF } from 'jspdf'
import logo from '../../Assets/img/logo.png'
import '../css/ticketmanagement.css'

const TicketManagementContent = () => {
  const [tickets, setTickets] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTicket, setEditingTicket] = useState(null)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [selectedTicketForCreate, setSelectedTicketForCreate] = useState(null)
  const [createQuantity, setCreateQuantity] = useState(1)
  const [createBonus, setCreateBonus] = useState(0)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    const TicketList = await getAllTicket()
    TicketList.sort((a, b) => b.price - a.price)
    setTickets(TicketList)
  }

  const handleSaveTicket = async (newTicket) => {
    if (editingTicket) {
      // Update ticket
      await updateTicketbyId(editingTicket._id, newTicket)
      message.success('Ticket updated successfully!')
    } else {
      // Add new ticket
      await createTicket(newTicket)
      message.success('Ticket added successfully!')
    }
    fetchTickets()
    setIsModalOpen(false)
    setEditingTicket(null)
  }

  const handleEdit = (ticket) => {
    setEditingTicket(ticket)
    setIsModalOpen(true)
  }

  const handleDelete = async (ticket) => {
    await deleteTicketbyId(ticket._id)
    message.success('Ticket deleted successfully!')
    fetchTickets()
  }

  const handleAddTicket = () => {
    setEditingTicket(null)
    setIsModalOpen(true)
  }

  const openCreateModal = (ticket) => {
    setSelectedTicketForCreate(ticket)
    setCreateQuantity(1)
    setCreateBonus(0)
    setCreateModalVisible(true)
  }

  const handleConfirmCreate = async () => {
    try {
      const invoice = await createTicketForNewMember(selectedTicketForCreate, createQuantity, createBonus)
      const invoiceData = await getInvoice(invoice.invoice.invoiceId)
      await updateInvoice(invoice.invoice.invoiceId, { ...invoiceData, status: 'PAID' })

      // generate PDF (simple)
      const doc = new jsPDF()
      const img = new Image()
      img.src = logo
      doc.addImage(img, 'PNG', 10, 5, 40, 20)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(18)
      doc.text('INVOICE', 105, 30, { align: 'center' })
      doc.save(`invoice_${invoiceData.invoiceNumber}.pdf`)

      message.success('Invoice created and PDF downloaded')
      setCreateModalVisible(false)
    } catch (error) {
      console.error('Create ticket for new member failed', error)
      message.error('Failed to create ticket')
    }
  }

  return (
    <div>
      <Button onClick={handleAddTicket} className='AD-add-user-button' disabled>
        Add Ticket
      </Button>
      <div style={{ textAlign: 'center' }}>
        <h2 className='ticket-title'>Ticket List</h2>
        <Table
          dataSource={tickets}
          rowKey={(record) => record._id}
          columns={[
            {
              title: 'Type',
              dataIndex: 'ticketType',
              key: 'ticketType',
              render: (text) => text && text.toUpperCase()
            },
            {
              title: 'Price',
              dataIndex: 'price',
              key: 'price',
              render: (text) => (text ? `${Number(text).toLocaleString('vi-VN')} VND` : '0 VND')
            },
            {
              title: 'Bonus Price',
              dataIndex: 'bonus',
              key: 'bonus',
              render: (text) => (text ? `${Number(text).toLocaleString('vi-VN')} VND` : '0 VND')
            },
    {
      title: 'Branch',
      dataIndex: 'branchname',
      key: 'branch',
      render: (text) => text || 'N/A',
      sorter: (a, b) => (a.branchname || '').localeCompare(b.branchname || '')
    }
            // {
            //   title: 'Actions',
            //   key: 'action',
            //   render: (_, record) => (
            //     <div style={{ display: 'flex', gap: 8 }}>
            //       <Button type='link' onClick={() => handleEdit(record)}>
            //         Edit
            //       </Button>
            //       <Popconfirm title='Are you sure to delete this ticket?' onConfirm={() => handleDelete(record)} okText='Yes' cancelText='No'>
            //         <Button type='link' danger>
            //           Delete
            //         </Button>
            //       </Popconfirm>
                  /* <Button type='link' onClick={() => openCreateModal(record)}>
                    Create
                  </Button> */
            //     </div>
            //   )
            // }
          ]}
        />

        <AddTicketModal
          isModalOpen={isModalOpen}
          handleModalClose={() => setIsModalOpen(false)}
          handleSaveTicket={handleSaveTicket}
          tickets={tickets}
          editingTicket={editingTicket}
        />

        <Modal
          title='Ticket Information'
          open={createModalVisible}
          onOk={handleConfirmCreate}
          onCancel={() => setCreateModalVisible(false)}
          okText='Create'
          cancelText='Cancel'
        >
          <p>Quantity:</p>
          <InputNumber min={1} value={createQuantity} onChange={(val) => setCreateQuantity(val)} />
          <span style={{ marginLeft: '12px', fontWeight: 'bold', color: '#1890ff' }}>x {selectedTicketForCreate?.price?.toLocaleString()} VND</span>
          <br />

          <p className='mt-2'>Bonus Parent:</p>
          <InputNumber min={0} max={5} value={createBonus} onChange={(val) => setCreateBonus(val)} />
          <span style={{ marginLeft: '12px', fontWeight: 'bold', color: '#1890ff' }}>x {selectedTicketForCreate?.bonus?.toLocaleString()} VND</span>
        </Modal>
      </div>
    </div>
  )
}

export default TicketManagementContent
