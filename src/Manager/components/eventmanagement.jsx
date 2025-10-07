import React, { useEffect, useState } from 'react'
import useCheckMobile from '../../hooks/useCheckMobile'
import { Button, DatePicker, Form, Input, message, Popconfirm, Space, Table } from 'antd'

import EditEventModal from './editeventmodal'

import '../css/manager.css'
import { getAllEvent, createEvent, deleteEventById, updateEventById } from '../../services/playgroundmanagerApi'
// import moment from "moment";
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const EventManagementContent = () => {
  const isMobile = useCheckMobile()
  const [events, setEvents] = useState([])
  useEffect(() => {
    fetchEvents()
  }, [])
  const fetchEvents = async () => {
    try {
      const eventList = await getAllEvent()
      // const sortedEvents = eventList.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      // console.log(sortedEvents);

      setEvents(eventList)
      //   console.log(eventList)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const [form] = Form.useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  // const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  // const [selectedEvent, setSelectedEvent] = useState(null);

  const DATE_FORMAT = 'DD-MM-YYYY HH:mm'

  const parseWithDayjs = (dateString) => {
    if (!dateString) return null
    // Use dayjs.utc() if you want to parse and treat the date as UTC
    const parsedDate = dayjs(dateString, DATE_FORMAT, true) // true enables strict parsing
    return parsedDate.isValid() ? parsedDate : null // Return dayjs object or null
  }

  const columns = [
    {
      title: 'Event Name',
      key: 'eventname',
      dataIndex: 'eventTitle',
      render: (text) => <strong>{text}</strong>,
      // render: (text, record) => (
      //     <Button type="link" onClick={() => handleNavigateToDetail(record)}>
      //         {text}
      //     </Button>
      // ),
      sorter: (a, b) => a.eventTitle.localeCompare(b.eventTitle)
    },
    {
      title: 'Start Date',
      key: 'startdate',
      dataIndex: 'startDate',
      defaultSortOrder: 'ascend',
      sorter: (a, b) => {
        const dateA = parseWithDayjs(a.startDate)
        const dateB = parseWithDayjs(b.startDate)

        // Handle null or invalid dates (place them at the end/start as desired)
        if (!dateA && !dateB) return 0 // Both invalid/null, treat as equal
        if (!dateA) return 1 // Place nulls/invalid A after B
        if (!dateB) return -1 // Place nulls/invalid B after A

        // Compare valid dates (using valueOf() for timestamp comparison)
        return dateA.valueOf() - dateB.valueOf()
      }
    },
    {
      title: 'End Date',
      key: 'enddate',
      dataIndex: 'endDate',
      sorter: (a, b) => {
        const dateA = parseWithDayjs(a.endDate)
        const dateB = parseWithDayjs(b.endDate)

        // Handle null or invalid dates
        if (!dateA && !dateB) return 0
        if (!dateA) return 1
        if (!dateB) return -1

        // Compare valid dates
        return dateA.valueOf() - dateB.valueOf()
      }
    },
    {
      title: 'Discont Rate',
      key: 'discountrate',
      dataIndex: 'discountRate',
      render: (text) => <span>{text}%</span>,
      sorter: (a, b) => a.discountRate - b.discountRate
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size='middle'>
          <Button className='edit-button' onClick={() => showEditEventModal(record)}>
            Edit
          </Button>
          {/* <Button className="assign-button" onClick={() => showAssignModal(record)}>Assign</Button> */}
          <Popconfirm
            title='Are you sure to delete this event?'
            onConfirm={() => handleDeleteEvent(record._id)}
            okText='Yes'
            cancelText='No'
          >
            <Button className='delete-button'>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // const handleNavigateToDetail = (event) => {
  //     navigate(`${event.key}`, { state: { event } });
  // };

  const showEditEventModal = (event) => {
    setEditingEvent(event)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingEvent(null)
  }

  const handleAddEvent = async () => {
    try {
      const values = await form.validateFields()
      const [start, end] = values.dateRange
      const newEvent = {
        eventTitle: values.eventname,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        eventDescription: values.description,
        backdrop: values.backdrop,
        discountRate: values.discount
      }
      console.log(newEvent)

      const createdEvent = await createEvent(newEvent)
      // const updatedEvents = [...events, createdEvent].sort(
      //     (a, b) => new Date(a.startDate) - new Date(b.startDate)
      // );
      // console.log(createdEvent);

      setEvents([...events, createdEvent])
      message.success('Event added successfully!')
      form.resetFields()
    } catch (error) {
      console.error('Failed to add event:', error)
      message.error('Failed to add event. Please try again.')
    }
  }

  const handleEditEvent = async (updatedEvent) => {
    try {
      const updateEvent = await updateEventById(updatedEvent._id, updatedEvent)
      setEvents((prevEvents) => prevEvents.map((event) => (event._id === updateEvent._id ? updateEvent : event)))
      fetchEvents()
      message.success('Event updated successfully!')
      handleModalClose()
    } catch (error) {
      console.error('Failed to update event:', error)
      message.error('Failed to update event. Please try again.')
    }
  }

  // const showAssignModal = (event) => {
  //     setSelectedEvent(event);
  //     setIsAssignModalOpen(true);
  // };

  // const handleAssign = (staff) => {
  //     console.log(`Assigned ${staff.name} to event: ${selectedEvent.eventname}`);
  //     message.success(`${staff.name} assigned to ${selectedEvent.eventname}`);
  //     setIsAssignModalOpen(false);
  // };

  const handleDeleteEvent = async (eventId) => {
    await deleteEventById(eventId)
    fetchEvents()
    message.success('Event deleted successfully!')
  }

  return (
    <>
      <Form
        layout={isMobile ? 'vertical' : 'horizontal'}
        form={form}
        labelCol={{
          flex: isMobile ? '' : '120px'
        }}
        labelAlign={'left'}
        wrapperCol={{
          flex: isMobile ? 1 : '600px'
        }}
        style={{
          maxWidth: 2000,
          paddingLeft: 16
        }}
      >
        <Form.Item
          label='Event Name'
          name='eventname'
          rules={[
            {
              required: true,
              message: 'Please input!'
            }
          ]}
        >
          <Input placeholder='Type Name...' />
        </Form.Item>
        <Form.Item
          label='Date Range'
          name='dateRange'
          rules={[
            {
              required: true,
              message: 'Please select date range!'
            }
          ]}
        >
          <RangePicker showTime format='DD/MM/YYYY HH:mm' />
        </Form.Item>
        <Form.Item
          label='Description'
          name='description'
          rules={[
            {
              required: true,
              message: "Please type event's description!"
            }
          ]}
        >
          <Input.TextArea placeholder='Type here...' />
        </Form.Item>
        {/* <Form.Item
                    label="Location"
                    name="location"
                    rules={[
                        {
                            required: true,
                            message: 'Please type event\'s location!',
                        },
                    ]}
                >
                    <Input placeholder="Type here..." />
                </Form.Item> */}
        <Form.Item
          label='Backdrop URL'
          name='backdrop'
          rules={[
            { required: true, message: 'Please input backdrop URL!' },
            {
              type: 'url',
              message: 'Please enter a valid URL (must start with http:// or https://)'
            }
          ]}
        >
          <Input placeholder='Paste backdrop image URL...' />
        </Form.Item>
        <Form.Item
          label='Discount'
          name='discount'
          rules={[
            {
              required: true,
              message: 'Please input discount rates!'
            }
          ]}
        >
          <Input type='number' placeholder='Discount Rate' addonAfter='%' />
        </Form.Item>
        <Form.Item>
          <Button style={{ backgroundColor: '#3b71ca', color: 'white' }} onClick={handleAddEvent}>
            Create
          </Button>
        </Form.Item>
      </Form>

      <div
        style={{
          marginTop: '20px',
          overflowX: 'auto'
        }}
      >
        <Table
          rowKey='_id'
          columns={columns}
          dataSource={events}
          size='middle'
          scroll={{
            x: 'max-content'
          }}
        />
      </div>

      {/* Edit Event Modal */}
      <EditEventModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={handleEditEvent}
        initialValues={editingEvent}
      />

      {/* Assign Staff Modal */}
      {/* {selectedEvent && (
                <AssignStaffModal
                    open={isAssignModalOpen}
                    onClose={() => setIsAssignModalOpen(false)}
                    onAssign={handleAssign}
                    eventId={selectedEvent.key}
                />
            )} */}
    </>
  )
}

export default EventManagementContent
