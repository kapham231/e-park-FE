import { useNavigate, useSearchParams } from 'react-router-dom'
// import { Button } from "antd";
import { useEffect, useState } from 'react'

import '../css/paymentsuccess.css'
import { changeInvoiceStatus, findInvoice } from '../../services/userApi'
import { useAuth } from '../../auth/authContext'
import DefaultButton from '../../components/DefaultButton'
import { downloadInvoice } from '../../utils/download-invoice'
import { downloadProductInvoice } from '@/utils/download-product-invoice'
import { getUserNameById } from '@/services/adminApi'

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [membershipDiscount, setMembershipDiscount] = useState(0)
  const [eventDiscountPrice, setEventDiscountPrice] = useState(0)
  const [userName, setUserName] = useState('')
  const auth = useAuth()
  const user = auth?.user || {}

  const [searchParams] = useSearchParams()
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const orderCode = searchParams.get('orderCode')
        // console.log(orderCode)

        let invoice = await findInvoice(orderCode)
        // console.log(invoice)

        await changeInvoiceStatus(invoice._id)
        // console.log(orderCode);

        invoice = await findInvoice(orderCode)
        const userName = await getUserNameById(invoice.customer)
        setUserName(userName)
        // console.log('username', userName)
        const invoiceData = { ...invoice, customer: userName }
        // console.log('invoice', invoiceData.name)
        
        if (invoice.__t === "InvoiceBooking") {
          setInvoice(invoiceData)
          const discountRate = Number(invoiceData.customer.discount) || 0
          const rawMembershipDiscount = (1 - discountRate) * (invoice.tickets[0].originalPrice - invoice.tickets[0].priceAfterEventDiscount) * invoice.tickets[0].quantity
          const a = Math.round(rawMembershipDiscount)
          const b = invoice.tickets[0].priceAfterEventDiscount * invoice.tickets[0].quantity
          console.log('membership discount', a)
          console.log(a, b)
          setMembershipDiscount(a)
          setEventDiscountPrice(b)
        }
        else if (invoice.__t === "InvoiceProduct") {
          // console.log('Product invoice')
          setInvoice(invoiceData)
        }
      } catch (error) {
        console.error('Error fetching invoice:', error)
      }
    }

    fetchInvoice()
  }, [searchParams])

  const paymentAmountTransform = (amount) => {
    if (amount) {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
    return 0
  }

  const formatISOTime = (time) => {
    return new Date(time).toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // const formatCurrency = (amount) => {
  // 	return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  // };

  useEffect(() => {
    if (invoice) {
      // console.log('Downloading invoice automatically', invoice)
      if (invoice.__t === "InvoiceProduct") {
        return downloadProductInvoice({
          ...invoice,
          subtotal: invoice.subtotal,
          qrCode: invoice.qrCode,
          name: invoice.customer.firstName ? (invoice.customer.firstName + ' ' + invoice.customer.lastName) : 'Guest',
          phone: invoice.customer.phoneNumber || '',
          email: invoice.customer.email || '',
          bookingDate: invoice.bookingDate
        })
      }
      downloadInvoice({
        ...invoice,
        membershipDiscount: membershipDiscount,
        eventDiscountPrice: eventDiscountPrice,
        subtotal: invoice.subtotal,
        qrCode: invoice.qrCode,
        name: invoice.customer.firstName ? (invoice.customer.firstName + ' ' + invoice.customer.lastName) : 'Guest',
        phone: invoice.customer.phoneNumber || '',
        email: invoice.customer.email || '',
        bookingDate: invoice.bookingDate
      })
    }
  }, [invoice])

  return (
    <div className='payment-success-wrapper'>
      <CircleCheckIcon className='payment-success-icon' />
      <h1 className='payment-success-header'>Payment Successful</h1>
      <p className='payment-success-subtext'>Thank you for your purchase!</p>
      <ul className='payment-success-details helper'>
        <li className='helper-text'>
          You must bring your ticket to the playground to receive your ticket, otherwise we will not be able to issue
          you a ticket.
        </li>
        <li className='helper-text'>Tickets are downloading after payment automatically.</li>
        <li className='helper-text'>
          If downloading does not work, please click the button below to download the ticket.
        </li>
      </ul>
      <DefaultButton
        type='danger'
        style={{ marginTop: '20px' }}
        onClick={() =>
          invoice?.__t === "InvoiceProduct" ? downloadProductInvoice({
            ...invoice,
            subtotal: invoice.subtotal,
            qrCode: invoice.qrCode,
            name: invoice.customer.firstName ? (invoice.customer.firstName + ' ' + invoice.customer.lastName) : 'Guest',
            phone: invoice.customer.phoneNumber || '',
            email: invoice.customer.email || '',
            bookingDate: invoice.bookingDate
          }) :
          downloadInvoice({
            ...invoice,
            membershipDiscount: membershipDiscount,
            eventDiscountPrice: eventDiscountPrice,
            subtotal: invoice.subtotal,
            qrCode: invoice.qrCode,
            name: invoice.customer.firstName ? (invoice.customer.firstName + ' ' + invoice.customer.lastName) : 'Guest',
            phone: invoice.customer.phoneNumber || '',
            email: invoice.customer.email || '',
            bookingDate: invoice.bookingDate,
          })
        }
      >
        Download Invoice
      </DefaultButton>
      <div className='payment-success-details details'>
        <div className='payment-success-item'>
          <span>Amount Paid:</span>
          <span className='item-value'>{paymentAmountTransform(invoice?.subtotal)} VND</span>
        </div>
        <div className='payment-success-item'>
          <span>Date & Time:</span>
          <span className='item-value'>{formatISOTime(invoice?.createdAt)}</span>
        </div>
      </div>
      <DefaultButton type='primary' style={{ marginTop: '20px' }} onClick={() => navigate('/user/homepage')}>
        Back to Homepage
      </DefaultButton>
    </div>
  )
}

function CircleCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='10' />
      <path d='m9 12 2 2 4-4' />
    </svg>
  )
}

export default PaymentSuccess
