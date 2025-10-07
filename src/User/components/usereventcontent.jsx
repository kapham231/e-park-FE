import { Button, Card, Col, Divider, Pagination, Row, Typography, Tooltip, Select, DatePicker, Empty, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import '../css/userevent.css'
import React, { useEffect, useState } from 'react'
import { getOngoingEvent, getUpcomingEvent } from '../../services/playgroundmanagerApi'
import moment from 'moment/moment'
const { Title } = Typography

const UserEventContent = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [filterRange, setFilterRange] = useState(null)
  const [height, setHeight] = useState(window.innerHeight)
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 8

  useEffect(() => {
    setLoading(true)
    switch (filter) {
      case 'upcoming':
        getUpcomingEvent()
          .then((res) => {
            setEvents(res.data)
          })
          .finally(() => setLoading(false))
        break
      case 'ongoing':
        getOngoingEvent()
          .then((res) => {
            setEvents(res.data)
          })
          .finally(() => setLoading(false))
        break
      default:
        const upcomingEvents = getUpcomingEvent()
        const ongoingEvents = getOngoingEvent()

        Promise.all([upcomingEvents, ongoingEvents])
          .then((res) => {
            const allEvents = [...res[0].data, ...res[1].data]
            setEvents(allEvents)
          })
          .finally(() => setLoading(false))
    }
  }, [filter])

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.documentElement.scrollTop = document.documentElement.clientHeight
    document.documentElement.scrollLeft = document.documentElement.clientWidth
  }, [])

  const handleGoToEventDetail = (event) => {
    navigate(`${event._id}`)
  }

  const handleImageError = (e) => {
    e.target.src = 'https://i.pinimg.com/736x/1e/8f/91/1e8f91aa672419128d45ad4a64e36c62.jpg'
  }

  // Get current events
  const indexOfLastEvent = currentPage * eventsPerPage
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent)

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scroll(0, 0)
  }

  const filterEventsByDate = currentEvents.filter((event) => {
    const eventStartDate = moment(event.startDate, 'DD-MM-YYYY')
    const eventEndDate = moment(event.endDate, 'DD-MM-YYYY')
    if (!filterRange) return true
    return (
      eventStartDate.isBetween(filterRange[0], filterRange[1], null, '[]') ||
      eventEndDate.isBetween(filterRange[0], filterRange[1], null, '[]')
    )
  })

  return (
    <div className='us-event-container' style={{ minHeight: `${height}px` }}>
      <h3 className='us-event-header'>Events</h3>
      <div className='us-event-filter'>
        <DatePicker.RangePicker
          className='us-event-date-picker'
          onChange={(d) => {
            if (d) setFilterRange([moment(d[0].toDate(), 'DD-MM-YYYY'), moment(d[1].toDate(), 'DD-MM-YYYY')])
            else setFilterRange(null)
          }}
          format='DD-MM-YYYY'
        />
        <Select
          value={filter}
          onChange={setFilter}
          className='us-event-type-filter'
          options={[
            { value: 'all', label: 'All' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'ongoing', label: 'Ongoing' }
          ]}
        />
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <Spin size='large' tip='Loading events...' />
        </div>
      ) : filterEventsByDate.length === 0 ? (
        <Empty
          description={<span>No events found. Check back later for upcoming events!</span>}
          style={{ margin: '40px 0' }}
        />
      ) : (
        <>
          <Row gutter={[24, 24]} style={{ alignItems: 'stretch' }}>
            {filterEventsByDate.map((event) => (
              <Col xs={24} sm={12} md={8} lg={6} key={event._id}>
                <Card
                  hoverable
                  cover={
                    <img
                      alt={event.eventTitle}
                      src={event.backdrop}
                      className='event-image'
                      onError={handleImageError}
                    />
                  }
                  style={{
                    height: '100%'
                  }}
                  className='event-card'
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%'
                    }}
                  >
                    <Tooltip title={event.eventTitle}>
                      <Title level={4} ellipsis={true} className='event-title'>
                        {event.eventTitle}
                      </Title>
                    </Tooltip>

                    <Divider style={{ margin: '12px 0' }} />

                    <p className='event-date'>
                      <strong>📅 Start Date:</strong> {event.startDate}
                    </p>
                    <p className='event-date'>
                      <strong>📅 End Date:</strong> {event.endDate}
                    </p>
                    <div className='event-btn-container'>
                      <Button
                        color='danger'
                        variant='solid'
                        className='event-btn detail-btn'
                        onClick={() => handleGoToEventDetail(event)}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
          <Pagination
            current={currentPage}
            pageSize={eventsPerPage}
            total={events.length}
            onChange={handlePageChange}
            style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
          />
        </>
      )}
    </div>
  )
}

export default UserEventContent
