import jsPDF from "jspdf";
import logo from "../Assets/img/logo.png";

const formatCurrencyForPDF = (amount) => {
	return amount.toLocaleString("vi-VN") + " VND";
};

export const downloadInvoice = (invoiceData) => {
    // Tạo một instance của jsPDF
    const doc = new jsPDF();

    // Thêm LOGO
    const img = new Image();
    img.src = logo; // Đường dẫn hình ảnh từ import
    doc.addImage(img, "PNG", 10, 5, 40, 20); // (x, y, width, height)

    // Tiêu đề hóa đơn
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("INVOICE", 105, 30, { align: "center" });

    // Ngày tạo hóa đơn
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const today = new Date().toLocaleDateString("vi-VN");
    // doc.text(`Date: ${today}`, 20, 50);

    // Trạng thái thanh toán
    const statusText = invoiceData.status === "PAID" ? "PAID" : "UNPAID";
    const statusColor = invoiceData.status === "PAID" ? [40, 167, 69] : [220, 53, 69]; // Xanh lá hoặc đỏ

    // Vẽ hộp trạng thái
    doc.setFillColor(...statusColor);
    doc.roundedRect(150, 40, 50, 10, 2, 2, "F");

    // Viết chữ trạng thái
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(statusText, 175, 47, { align: "center" });

    // Reset màu chữ về đen
    doc.setTextColor(0, 0, 0);

    // Thông tin khách hàng
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Customer Information", 20, 60);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Customer Name: ${invoiceData.name}`, 20, 70);
    doc.text(`Phone: ${invoiceData.phone}`, 20, 78);
    doc.text(`Email: ${invoiceData.email}`, 20, 86);
    doc.text(`Booking Date: ${today}`, 20, 94);
    doc.text(`Location: Central E-park, Vincom Vo Van Ngan, Thu Duc, Ho Chi Minh`, 20, 102);

    // Divider
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, 108, 190, 108);

    // Thông tin vé
    let startY = 118;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Ticket Details", 20, startY);

    startY += 10;
    invoiceData.tickets.forEach((ticket) => {
        const ticketTotal = invoiceData.tickets[0].originalPrice * ticket.quantity;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(ticket.ticketType, 20, startY); // Tên vé
        doc.text(formatCurrencyForPDF(invoiceData.tickets[0].originalPrice), 190, startY, { align: "right" }); // Giá vé
        startY += 8;

        doc.text(`Quantity: ${ticket.quantity}`, 20, startY); // Số lượng
        startY += 8;
        doc.text("Total Ticket Price", 20, startY);
        doc.text(formatCurrencyForPDF(ticketTotal), 190, startY, { align: "right" }); // Tổng tiền vé (giá * số lượng)
        startY += 10; // Thêm khoảng cách giữa các vé
    });

    // Divider
    doc.setDrawColor(200, 200, 200); // Sử dụng màu xám nhẹ cho divider
    doc.setLineWidth(0.2); // Giảm độ dày của đường kẻ
    doc.line(20, startY, 190, startY);
    startY += 10;

    // Thông tin bonus nếu có
    if (invoiceData.tickets[0].bonus > 0) {
        const extraPrice = invoiceData.tickets[0].bonusAmount / invoiceData.tickets[0].bonus; // Giá tiền của mỗi extra
        const extraTotal = invoiceData.tickets[0].bonusAmount; // Tổng tiền extra

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text("Extra Parent", 20, startY);
        doc.text(formatCurrencyForPDF(extraPrice), 190, startY, { align: "right" });
        startY += 8;

        doc.text(`Quantity: ${invoiceData.tickets[0].bonus}`, 20, startY); // Số lượng extra parent
        startY += 8;

        doc.text("Total Extra Parent Amount", 20, startY);
        doc.text(formatCurrencyForPDF(extraTotal), 190, startY, { align: "right" });
        startY += 10;
    }

    // Divider
    doc.setLineWidth(0.5); // Đặt lại độ dày của đường kẻ
    doc.setDrawColor(0, 0, 0); // Đặt lại màu mặc định (đen) cho các divider còn lại
    doc.line(20, startY, 190, startY);
    startY += 10;

    // Tổng discount
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Total Discount", 20, startY);
    doc.text(`- ${formatCurrencyForPDF(invoiceData.eventDiscountPrice + invoiceData.membershipDiscount)}`, 190, startY, { align: "right" });
    startY += 10;

    // Tổng giá trị hóa đơn
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount", 20, startY);
    doc.text(formatCurrencyForPDF(invoiceData.subtotal), 190, startY, { align: "right" });

    // QR Code
    if (invoiceData.qrCode) {
        const qrImg = new Image();
        qrImg.src = invoiceData.qrCode;
        doc.addImage(qrImg, "PNG", 80, startY + 20, 50, 50); // Thêm QR code vào hóa đơn
    }

    // Xuất file PDF
    doc.save(`invoice_${invoiceData.invoiceNumber}.pdf`);
};