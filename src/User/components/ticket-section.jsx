import { useEffect, useState } from 'react'
// import { useNavigate } from "react-router-dom";
import { getAllTicket } from '../../services/playgroundmanagerApi'

import '../css/ticket-section.css'

const TicketSection = () => {
  const [ticketList, setTicketList] = useState([])
  const [activeTicket, setActiveTicket] = useState(-1)
  // const navigate = useNavigate();
  useEffect(() => {
    getAllTicket().then((data) => {
      setTicketList(data)
    })
  }, [])

  const handleClickTicket = (index) => {
    setActiveTicket(index)
  }

  const formatCurrency = (value) => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' VND'
  }

  return (
    <div className='user-ticket-section'>
      <h2>Ticket List</h2>
      <div className='user-ticket-container'>
        <div className='user-ticket-list'>
          {ticketList.map((ticket, index) => {
            return (
              <div
                key={ticket['_id']}
                className={'user-ticket-item ' + (activeTicket === index ? 'active' : '')}
                style={{ background: ticket['backgroundColor'] }}
                onClick={() => handleClickTicket(index)}
              >
                <h3>{ticket['ticketType']}</h3>
              </div>
            )
          })}
        </div>
        <div className='user-ticket-details'>
          <h3 style={{ marginBottom: '20px' }}>Ticket Details</h3>
          <div className='user-ticket-details-content'>
            {activeTicket < 0 ? (
              <p>Click on a ticket to see details</p>
            ) : (
              <div>
                <h5>
                  <strong>🎟 Ticket Type:</strong> {ticketList[activeTicket]['ticketType']}
                </h5>
                <h5>
                  <strong>💰 Price:</strong> {formatCurrency(ticketList[activeTicket]['price'])}
                </h5>
                <p></p>
                {ticketList[activeTicket]['ticketType'] === 'Normal' ? (
                  <p>
                    <em>(Valid from Monday to Friday)</em>
                  </p>
                ) : (
                  <p>
                    <em>(Valid for Saturday and Sunday)</em>
                  </p>
                )}
                <p>👨‍👩‍👧‍👦 Ticket is valid for 1 parent and 1 child.</p>
                <p>
                  ✅ Enjoy an affordable price of only {formatCurrency(ticketList[activeTicket]['price'])} for both.
                </p>
                <p>➕ Additional parent: {formatCurrency(ticketList[activeTicket]['bonus'])} per person.</p>
                <p>
                  ✨ Come experience exciting activities, safe play zones, and memorable family moments—all waiting for
                  you at E-Park, the ideal destination for a joyful day out!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketSection
