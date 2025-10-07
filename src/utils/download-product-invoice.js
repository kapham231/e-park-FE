import jsPDF from 'jspdf'
import logo from '../Assets/img/logo.png'

const formatCurrencyForPDF = (amount) => {
  return amount.toLocaleString('vi-VN') + ' VND'
}

export const downloadProductInvoice = (invoiceData) => {
  // Tạo một instance của jsPDF
  const doc = new jsPDF()

  // Thêm LOGO
  const img = new Image()
  img.src = logo // Đường dẫn hình ảnh từ import
  doc.addImage(img, 'PNG', 10, 5, 40, 20) // (x, y, width, height)

  // Tiêu đề hóa đơn
  doc.setFont('times', 'bold')
  doc.setFontSize(22)
  doc.text('INVOICE', 105, 30, { align: 'center' })

  // Ngày tạo hóa đơn
  doc.setFontSize(12)
  doc.setFont('times', 'normal')
  const today = new Date().toLocaleDateString('vi-VN')
  // doc.text(`Date: ${today}`, 20, 50);

  // Trạng thái thanh toán
  const statusText = invoiceData.status === 'PAID' ? 'PAID' : 'UNPAID'
  const statusColor = invoiceData.status === 'PAID' ? [40, 167, 69] : [220, 53, 69] // Xanh lá hoặc đỏ

  // Vẽ hộp trạng thái
  doc.setFillColor(...statusColor)
  doc.roundedRect(150, 40, 50, 10, 2, 2, 'F')

  // Viết chữ trạng thái
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(12)
  doc.setFont('times', 'bold')
  doc.text(statusText, 175, 47, { align: 'center' })

  // Reset màu chữ về đen
  doc.setTextColor(0, 0, 0)

  // Thông tin khách hàng
  doc.setFontSize(14)
  doc.setFont('times', 'bold')
  doc.text('Customer Information', 20, 60)
  doc.setFontSize(12)
  doc.setFont('times', 'normal')
  doc.text(`Customer Name: ${invoiceData.customer.firstName + ' ' + invoiceData.customer.lastName}`, 20, 70)
  doc.text(`Phone: ${invoiceData.customer.phoneNumber}`, 20, 78)
  doc.text(`Email: ${invoiceData.customer.email}`, 20, 86)
  doc.text(`Buying Date: ${today}`, 20, 94)

  // Divider
  doc.setDrawColor(0)
  doc.setLineWidth(0.5)
  doc.line(20, 108, 190, 108)

  // Thông tin vé
  let startY = 118
  doc.setFontSize(14)
  doc.setFont('times', 'bold')
  doc.text('Product Details', 20, startY)

  startY += 10
  invoiceData.products.forEach((product) => {
    doc.setFontSize(12)
    doc.setFont('times', 'normal')
    doc.text(product.name, 20, startY)
    doc.text(formatCurrencyForPDF(product.price), 190, startY, { align: 'right' }) // Giá vé
    startY += 8

    doc.text(`Quantity: ${product.quantity}`, 20, startY) // Số lượng
    startY += 8
    doc.text('Total Product Price', 20, startY)
    doc.text(formatCurrencyForPDF(product.subtotal), 190, startY, { align: 'right' }) // Tổng tiền vé (giá * số lượng)
    startY += 10 // Thêm khoảng cách
  })

  // Divider
  doc.setDrawColor(200, 200, 200) // Sử dụng màu xám nhẹ cho divider
  doc.setLineWidth(0.2) // Giảm độ dày của đường kẻ
  doc.line(20, startY, 190, startY)
  startY += 10

  // Divider
  doc.setLineWidth(0.5) // Đặt lại độ dày của đường kẻ
  doc.setDrawColor(0, 0, 0) // Đặt lại màu mặc định (đen) cho các divider còn lại
  doc.line(20, startY, 190, startY)
  startY += 10

  // Tổng giá trị hóa đơn
  doc.setFontSize(14)
  doc.setFont('times', 'bold')
  doc.text('Total Amount', 20, startY)
  doc.text(formatCurrencyForPDF(invoiceData.subtotal), 190, startY, { align: 'right' })

  // QR Code
  if (invoiceData.qrCode) {
    const qrImg = new Image()
    qrImg.src = invoiceData.qrCode
    doc.addImage(qrImg, 'PNG', 80, startY + 20, 50, 50) // Thêm QR code vào hóa đơn
  }

  // Xuất file PDF
  doc.save(`invoice_${invoiceData.invoiceNumber}.pdf`)
}
