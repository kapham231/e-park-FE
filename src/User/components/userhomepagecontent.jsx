import { Button, Card, Divider } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import value1 from '../../Assets/img/value1.jpg'
import value2 from '../../Assets/img/value2.jpg'
import value3 from '../../Assets/img/value3.jpg'
import value4 from '../../Assets/img/value4.jpg'
import feature1 from '../../Assets/img/feature1.png'
import feature2 from '../../Assets/img/feature2.png'
import feature3 from '../../Assets/img/feature3.png'

import '../css/userhomepagecontent.css'
import Carousel3D from './carousel3d'
import CustomSlider from './customslider'
import TicketSection from './ticket-section'
import { useEffect, useState } from 'react'
import { getUpcomingEvent } from '../../services/playgroundmanagerApi'
// import { useAuth } from "../../auth/authContext";

const UserHomepageContent = () => {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  // const { user } = useAuth();
  // console.log(user);

  useEffect(() => {
    getUpcomingEvent().then((res) => {
      setEvents(res.data)
    })
  }, [])

  console.log(events)
  const images = [
    'https://i.pinimg.com/736x/38/80/cf/3880cf79bbe2fa01c5dffb53555df5dd.jpg',
    'https://kientrucsuvietnam.vn/wp-content/uploads/2022/05/khu-vui-choi-tre-em-ngoai-troi.jpeg',
    'https://i.pinimg.com/736x/a5/f7/d0/a5f7d0a9be7a69555017cfe29f87ece2.jpg',
    'https://i.pinimg.com/736x/f8/08/30/f808304b24e552cf88b77a282800116e.jpg'
  ]

  const valuePropositions = [
    { img: value1, text: 'Happy Environment' },
    { img: value2, text: 'Active Learning' },
    { img: value3, text: 'Creative Activity' },
    { img: value4, text: 'Amazing Playground' }
  ]

  const vouchers = [
    {
      id: 1,
      title: 'Silver Member',
      benefits: [
        'Decrease 5% in total bill',
        'Buy ticket bigger or equal 10.000 VND will get 1 loyalty point for each 10.000 VND',
        'Get 1 ice cream for free with each 15 loyalty points'
      ],
      image: 'https://i.pinimg.com/736x/b8/1f/a0/b81fa051818c3397233076a51f70c7e0.jpg'
    },
    {
      id: 2,
      title: 'Platinum Member',
      benefits: [
        'Decrease 15% in total bill',
        'Buy ticket bigger or equal 10.000 VND will get 1 loyalty point for each 5.000 VND',
        'Get 1 mini toy and 1 ice cream for free with each 10 loyalty points'
      ],
      image: 'https://i.pinimg.com/736x/00/4c/5b/004c5b6d9e87e4a762be7039405ba2be.jpg'
    },
    {
      id: 3,
      title: 'Gold Member',
      benefits: [
        'Decrease 10% in total bill',
        'Buy ticket bigger or equal 10.000 VND will get 1 loyalty point for each 7.500 VND',
        'Get 1 mini toy for free with each 12 loyalty points'
      ],
      image: 'https://i.pinimg.com/736x/49/c7/2a/49c72aefa242ffa7a6ece45371ee291b.jpg'
    }
  ]

  const features = [
    {
      id: 1,
      title: 'Create Environment',
      description: 'We create an environment for kids after stress lessons at school.',
      icon: feature1
    },
    {
      id: 2,
      title: 'Fast Contact',
      description: 'We have a crew of staff working 24/7 to support you.',
      icon: feature2
    },
    {
      id: 3,
      title: 'Play parallel with study',
      description:
        'We are committed to every activity in the playground, entertaining children while stimulating creativity.',
      icon: feature3
    }
  ]

  const handleImageError = (e) => {
    e.target.src = 'https://i.pinimg.com/736x/1e/8f/91/1e8f91aa672419128d45ad4a64e36c62.jpg'
  }

  return (
    <div>
      <div className='us-homepage-section'>
        <h1 className='us-homepage-title'>Welcome to E-Park</h1>
        <div className='slider'>
          <Carousel3D images={images} />
        </div>
      </div>

      <div className='us-homepage-section'>
        <div className='value-proposition'>
          <h2 className='section-title'>Value Proposition</h2>
          <div className='value-items'>
            {valuePropositions.map((item, index) => (
              <div key={index} className='value-item'>
                <img src={item.img} alt={item.text} />
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='us-homepage-section upcoming-event'>
        <h2>Upcoming Events</h2>
        <CustomSlider>
          {events.map((event) => (
            <Card
              hoverable
              cover={
                <img alt={event.eventTitle} src={event.backdrop} className='event-image' onError={handleImageError} />
              }
              style={{
                height: '100%'
              }}
              className='event-card'
              key={event.id}
            >
              <Card.Meta title={event.eventTitle} />

              <Divider style={{ margin: '12px 0' }} />

              <p className='event-date'>
                <strong>📅 Start date:</strong> {event.startDate}
              </p>
              <p className='event-date'>
                <strong>📅 End date:</strong> {event.endDate}
              </p>

              <Divider style={{ margin: '12px 0' }} />

              <div className='event-btn-container'>
                <Button
                  color='danger'
                  variant='solid'
                  className='event-btn detail-btn'
                  onClick={() => {
                    navigate(`/user/event/${event.id}`)
                    window.scrollTo(0, 0)
                  }}
                >
                  Details
                </Button>
              </div>
            </Card>
          ))}
        </CustomSlider>
        <Link to={'/user/event'} className='view-all-link' onClick={() => window.scrollTo(0, 0)}>
          View All Event →
        </Link>
      </div>

      <div className='us-homepage-section voucher-feed'>
        <h2>Membership Discount</h2>
        <div className='voucher-list'>
          {vouchers.map((voucher) => (
            <div key={voucher.id} className='voucher-card'>
              <div className='voucher-header'>
                <h3>{voucher.title}</h3>
              </div>
              <div className='voucher-body'>
                <img src={voucher.image} alt={voucher.title} />
                <ul>
                  {voucher.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TicketSection />

      <div className='us-homepage-section'>
        <div className='what-we-do'>
          <h2>What we do ?</h2>
          <div className='features-list'>
            {features.map((feature) => (
              <div key={feature.id} className='feature-card'>
                <img src={feature.icon} alt={feature.title} />
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserHomepageContent
