import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getAllInvoice } from '../../services/userApi'
import { getUserNameById } from '../../services/adminApi'
import { downloadInvoice } from '../../utils/download-invoice'
import { downloadProductInvoice } from '../../utils/download-product-invoice'
import { Button, Divider, Table } from 'antd'
import '../css/invoicedetail.css'

const UserInvoiceDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [customerInfo, setCustomerInfo] = useState(null)
  const [discounts, setDiscounts] = useState({ membership: 0, event: 0, voucher:0 })

  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      try {
        setLoading(true)
        const allInvoices = await getAllInvoice()
        const currentInvoice = allInvoices.find((inv) => inv._id === id)

        if (!currentInvoice) {
          navigate('/user/history')
          return
        }

        // Fetch customer info
        const userInfo = await getUserNameById(currentInvoice.customer)
        setCustomerInfo(userInfo)
        let voucher = 0
        if (currentInvoice.voucher){
            voucher = currentInvoice.voucher.discountAmount
        }
        // Calculate discounts for booking
        if (currentInvoice.__t === 'InvoiceBooking' && currentInvoice.tickets?.[0]) {
          const discountRate = Number(userInfo.discount) || 0
          const rawMembershipDiscount =
            (1 - discountRate) *
            ((currentInvoice.tickets[0].originalPrice - currentInvoice.tickets[0].priceAfterEventDiscount) *
            currentInvoice.tickets[0].quantity + (currentInvoice.tickets[0].bonusAmount))
          setDiscounts({
            membership: Math.round(rawMembershipDiscount),
            event: currentInvoice.tickets[0].priceAfterEventDiscount * currentInvoice.tickets[0].quantity,
            voucher: voucher
          })
        }

        setInvoice({ ...currentInvoice, customer: userInfo })
      } catch (error) {
        console.error('Error fetching invoice detail:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchInvoiceDetail()
  }, [id, navigate])

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '0'
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' VND'
  }

  const getInvoiceTypeLabel = (invoiceType) => {
    switch (invoiceType) {
      case 'InvoiceBooking':
        return 'Hóa đơn đặt vé'
      case 'InvoiceProduct':
        return 'Hóa đơn sản phẩm'
      default:
        return 'Hóa đơn'
    }
  }

  const formatISOTime = (time) => {
  return new Date(time).toLocaleString("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

  const getStatusColor = (status) => {
    return status === 'PAID' ? '#28a745' : '#b71c1c'
  }

  const handleDownload = () => {
    if (!invoice || !customerInfo) return

    if (invoice.__t === 'InvoiceProduct') {
      downloadProductInvoice({
        ...invoice,
        subtotal: invoice.subtotal,
        qrCode: invoice.qrCode,
        name: customerInfo?.firstName ? `${customerInfo.firstName} ${customerInfo.lastName}` : 'Guest',
        phone: customerInfo?.phoneNumber || '',
        email: customerInfo?.email || '',
        bookingDate: invoice.bookingDate
      })
    } else {
      downloadInvoice({
        ...invoice,
        membershipDiscount: discounts.membership,
        eventDiscountPrice: discounts.event,
        subtotal: invoice.subtotal,
        qrCode: invoice.qrCode,
        name: customerInfo?.firstName ? `${customerInfo.firstName} ${customerInfo.lastName}` : 'Guest',
        phone: customerInfo?.phoneNumber || '',
        email: customerInfo?.email || '',
        bookingDate: invoice.bookingDate
      })
    }
  }

  if (loading) {
    return <div className="invoice-loading">Đang tải thông tin hóa đơn...</div>
  }

  if (!invoice) {
    return <div className="invoice-error">Không tìm thấy hóa đơn</div>
  }

  return (
    <div className="invoice-detail-wrapper">
      {/* Header */}
      <div className="invoice-header">
        <div className="invoice-header-content">
          <Button 
            type="text" 
            onClick={() => navigate('/user/history')}
            className="back-button"
          >
            <i className="fas fa-chevron-left"></i> Quay lại
          </Button>
          <h1>{getInvoiceTypeLabel(invoice.__t)}</h1>
        </div>
      </div>

      <div className="invoice-container">
        {/* Invoice Info Card */}
        <div className="invoice-card info-card">
          <div className="card-row">
            <div className="card-col">
              <label>Mã Hóa đơn</label>
              <p className="card-value">{invoice?.orderCode || ""}</p>
            </div>
            <div className="card-col">
              <label>Loại</label>
              <p className="card-value">{getInvoiceTypeLabel(invoice.__t)}</p>
            </div>
            <div className="card-col">
              <label>Ngày tạo</label>
              <p className="card-value">{formatISOTime(invoice.createdAt)}</p>
            </div>
            <div className="card-col">
              <label>Trạng thái</label>
              <p className="card-value status" style={{ color: getStatusColor(invoice.status) }}>
                {invoice.status || 'UNKNOWN'}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Info Card */}
        <div className="invoice-card customer-card">
          <h3 className="card-title">
            <i className="fas fa-user"></i> Thông tin Khách hàng
          </h3>
          <div className="card-row">
            <div className="card-col">
              <label>Tên</label>
              <p className="card-value">
                {customerInfo?.firstName && customerInfo?.lastName
                  ? `${customerInfo.firstName} ${customerInfo.lastName}`
                  : 'Guest'}
              </p>
            </div>
            <div className="card-col">
              <label>Email</label>
              <p className="card-value">{customerInfo?.email || 'N/A'}</p>
            </div>
            <div className="card-col">
              <label>Điện thoại</label>
              <p className="card-value">{customerInfo?.phoneNumber || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Items/Products Card */}
        {invoice.__t === 'InvoiceProduct' && invoice.products ? (
          <div className="invoice-card items-card">
            <h3 className="card-title">
              <i className="fas fa-shopping-cart"></i> Sản phẩm
            </h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {invoice.products.map((product, idx) => (
                  <tr key={idx}>
                    <td>{product.name || 'N/A'}</td>
                    <td className="text-center">{product.quantity || 0}</td>
                    <td className="text-center">{formatCurrency(product.price)}</td>
                    <td className="text-center">{formatCurrency((product.price || 0) * (product.quantity || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : invoice.__t === 'InvoiceBooking' && invoice.tickets ? (
          <div className="invoice-card items-card">
            <h3 className="card-title">
              <i className="fas fa-ticket"></i> Vé
            </h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Vé</th>
                  <th>Số lượng</th>
                  <th>Số người đi kèm</th>
                  <th>Giá gốc</th>
                  <th>Phụ thu</th>
                  <th>Tổng tiền</th>
                  <th>Giá giảm</th>
                </tr>
              </thead>
              <tbody>
                {invoice.tickets.map((ticket, idx) => (
                  <tr key={idx}>
                    <td>{ticket.ticketType || 'N/A'}</td>
                    <td className="text-center">{ticket.quantity || 0}</td>
                    <td className="text-center">{ticket.bonus || 0}</td>
                    <td className="text-center">{formatCurrency(ticket.originalPrice)}</td>
                    <td className="text-center">{formatCurrency(ticket.bonusAmount)}</td>
                    <td className="text-center">{formatCurrency(ticket.originalPrice*ticket.quantity+ticket.bonusAmount)}</td>
                    <td className="text-right">
                      {formatCurrency(ticket.originalPrice*ticket.quantity+ticket.bonusAmount-ticket.totalForTicketType)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {/* Summary Card */}
        <div className="invoice-card summary-card">
          <h3 className="card-title">
            <i className="fas fa-calculator"></i> Tóm tắt
          </h3>
          {/* <div className="summary-row">
            <span>Tổng tiền:</span>
            <span className="summary-value">{formatCurrency(invoice.subtotal + discounts.event + discounts.membership)}</span>
          </div> */}

          {invoice.__t === 'InvoiceBooking' && (
            <>
            <div className="summary-row">
            <span>Tổng tiền:</span>
            <span className="summary-value">{formatCurrency(invoice.tickets[0].originalPrice*invoice.tickets[0].quantity+invoice.tickets[0].bonusAmount)}</span>
          </div>
              <div className="summary-row">
                <span>Chiết khấu sự kiện:</span>
                <span className="summary-value discount">-{formatCurrency(discounts.event)}</span>
              </div>
              <div className="summary-row">
                <span>Chiết khấu hội viên:</span>
                <span className="summary-value discount">-{formatCurrency(discounts.membership)}</span>
              </div>
              <div className="summary-row">
                <span>Mã giảm giá:</span>
                <span className="summary-value discount">-{formatCurrency(discounts.voucher)}</span>
              </div>
            </>
          )}

          <Divider style={{ margin: '12px 0' }} />

          <div className="summary-row total">
            <span>Tổng cộng:</span>
            <span className="summary-value">{formatCurrency(invoice.subtotal - discounts.voucher)}</span>
          </div>
        </div>

        {/* Voucher Card */}
        {invoice.voucher && (
          <div className="invoice-card voucher-card">
            <h3 className="card-title">
              <i className="fas fa-tag"></i> Voucher đã áp dụng
            </h3>
            <div className="voucher-info">
              <div className="voucher-code">
                <span className="voucher-label">Mã voucher:</span>
                <span className="voucher-value">{invoice.voucher.code}</span>
              </div>
              <div className="voucher-discount">
                <span className="voucher-label">Giảm giá:</span>
                <span className="voucher-value discount">-{formatCurrency(invoice.voucher.discountAmount || 0)}</span>
              </div>
              {invoice.voucher.description && (
                <div className="voucher-description">
                  <span className="voucher-label">Mô tả:</span>
                  <span className="voucher-value">{invoice.voucher.description}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="invoice-actions">
          <Button type="primary" onClick={handleDownload} className="download-btn">
            <i className="fas fa-download"></i> Tải hóa đơn
          </Button>
          <Button onClick={() => navigate('/user/history')} className="back-btn">
            Quay lại danh sách
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserInvoiceDetail
