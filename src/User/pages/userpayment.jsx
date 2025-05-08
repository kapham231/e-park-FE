import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Divider, Typography, Alert, message } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from "@ant-design/icons";
import jsPDF from "jspdf";
import dayjs from "dayjs";
// import { autoTable as jsPDFAutoTable } from "jspdf-autotable";
// import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
// import { getEvent } from "../../ApiService/playgroundmanagerApi";
import { bookingPrice, createPayOS, getInvoice } from "../../ApiService/userApi";

import banking from "../../Assets/img/banking.png";
import logo from "../../Assets/img/logo.png";

import '../css/userpayment.css';

const { Title, Text } = Typography;

const formatCurrency = (amount) => {
	return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
};

const formatCurrencyForPDF = (amount) => {
	return amount.toLocaleString("vi-VN") + " VND";
};

const UserPayment = () => {
	// const [event, setEvent] = useState({});
	const [paymentMethod, setPaymentMethod] = useState("Cod");
	// const { id } = useParams();
	const { state } = useLocation();
	const navigate = useNavigate();
	const order = state?.order;

	console.log("Order:", order);


	const [totalPrice, setTotalPrice] = useState(0);
	const [invoiceId, setInvoiceId] = useState(null);
	const [membershipDiscount, setMembershipDiscount] = useState(0);
	const [totalPriceofTicket, setTotalPriceofTicket] = useState(0);
	const [extraParentPrice, setExtraParentPrice] = useState(0);
	const [eventDiscountPrice, setEventDiscountPrice] = useState(0);
	const [qrCode, setQrCode] = useState(null);

	// const [searchParams] = useSearchParams();
	// let status;
	// console.log(order);

	// const ticketsList = order.tickets;
	// console.log("Tickets List:", ticketsList);

	useEffect(() => {
		// getEvent(id)
		// 	.then(event => {
		// 		setEvent(event);
		// 	})

		fetchBookingPrice();
		console.log(1);
	}, []);

	// Fetch Order Detail
	const fetchBookingPrice = async () => {
		try {
			const ticket = {
				ticketId: order.ticketId,
				quantity: order.quantity,
				bonus: order.bonus
			};
			const response = await bookingPrice(ticket, order.customerId, order.bookingDate);
			console.log(response);


			setQrCode(response.invoice.qrCode);
			setTotalPriceofTicket(response.ticketDetail[0].originalPrice * response.ticketDetail[0].quantity);
			setExtraParentPrice(response.ticketDetail[0].bonusAmount);
			setEventDiscountPrice(response.ticketDetail[0].priceAfterEventDiscount * response.ticketDetail[0].quantity);
			setMembershipDiscount(response.ticketDetail[0].membershipDiscount);
			setTotalPrice(response.summary.finalPrice);
			setInvoiceId(response.invoice.invoiceId);
		} catch (error) {
			console.error("Error fetching booking price:", error);
		}
	};

	const formatDate = (dateString) => {
		if (!dateString || !dayjs(dateString).isValid()) {
			console.error("Invalid dateString:", dateString); // Log giá trị không hợp lệ
			return "N/A"; // Trả về "N/A" nếu không có ngày hoặc ngày không hợp lệ
		}
		return dayjs(dateString).format('DD/MM/YYYY');
	};

	const handlePlaceOrder = async (invoiceId) => {
		const invoice = await getInvoice(invoiceId);
		console.log("invoice", invoice);

		if (paymentMethod === "Cod") {
			// console.log("invoiceId", invoiceId);

			// console.log("invoice", invoice);
			generatePDF(invoice);
			message.success("Order booked successfully! Please bring the invoice with you to playground to make a payment.");
		}
		else {
			// const newInvoice = await updateInvoice(invoiceId, { status: "PAID" });
			// generatePDF(newInvoice);
			const payOS = await createPayOS(invoiceId);
			if (payOS) {
				window.location.href = payOS; // Chuyển hướng đến trang thanh toán của PayOS
			} else {
				message.error("Failed to initiate payment. Please try again.");
			}
		}
	}


	const generatePDF = (invoiceData) => {
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
		doc.text(`Customer Name: ${order.name}`, 20, 70);
		doc.text(`Phone: ${order.phone}`, 20, 78);
		doc.text(`Email: ${order.email}`, 20, 86);
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
		doc.text(`- ${formatCurrencyForPDF(eventDiscountPrice + membershipDiscount)}`, 190, startY, { align: "right" });
		startY += 10;

		// Tổng giá trị hóa đơn
		doc.setFontSize(14);
		doc.setFont("helvetica", "bold");
		doc.text("Total Amount", 20, startY);
		doc.text(formatCurrencyForPDF(invoiceData.subtotal), 190, startY, { align: "right" });

		// QR Code
		if (qrCode) {
			const qrImg = new Image();
			qrImg.src = qrCode;
			doc.addImage(qrImg, "PNG", 80, startY + 20, 50, 50); // Thêm QR code vào hóa đơn
		}

		// Xuất file PDF
		doc.save(`invoice_${invoiceData.invoiceNumber}.pdf`);
	};

	if (!order) return <h2>Order not found</h2>;


	return (
		<div className="us-payment-container">
			<div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
				{/* Vùng 1: Thông tin sự kiện */}
				{/* <Card title={<Title level={3}>🎉 {event.eventTitle}</Title>}>
				<Text style={{ fontSize: "16px" }}>📅 <strong>Start date: </strong>{event.startDate}</Text><br />
				<Text style={{ fontSize: "16px" }}>📅 <strong>End date: </strong>{event.endDate}</Text><br />
				<Text style={{ fontSize: "16px" }}>📍 <strong>Location: </strong>{event.location}</Text><br />
			</Card> */}

				{/* Vùng 2: Thông tin đơn hàng */}
				<Card title={<Title level={3}>📝 Order Information</Title>}>
					<Text style={{ fontSize: "16px" }}><UserOutlined /> <strong>Name:</strong> {order.name}</Text><br />
					<Text style={{ fontSize: "16px" }}><PhoneOutlined /> <strong>Phone:</strong> {order.phone}</Text><br />
					<Text style={{ fontSize: "16px" }}><MailOutlined /> <strong>Email:</strong> {order.email}</Text><br />
					<Text style={{ fontSize: "16px" }}><ClockCircleOutlined /> <strong>Order Date:</strong> {formatDate(order.bookingDate)}</Text><br />
					<Divider />
					<Title level={4}>🎟️ Tickets Quantity</Title>
					<Text style={{ fontSize: "16px", display: "block" }}>
						<strong>{order.ticketType}:</strong> {order.quantity || 0}
					</Text>
					<Text style={{ fontSize: "16px", display: "block" }}>
						<strong>Extra Parent</strong> {order.bonus || 0}
					</Text>
				</Card>

				{/* Vùng 3: Chi tiết thanh toán */}
				<Card title={<Title level={3}>💰 Payment Detail</Title>}>
					{/* <Text style={{ fontSize: "16px" }}>🎟️ <strong>Ticket Price:</strong> {formatCurrency(totalPriceofTicket)}</Text><br /> */}
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
						<Text style={{ fontSize: "16px" }}>🎟️ <strong>Ticket Price:</strong></Text>
						<Text style={{ fontSize: "16px", color: "black" }}>{formatCurrency(totalPriceofTicket)}</Text>
					</div>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
						<Text style={{ fontSize: "16px" }}>🎟️ <strong>Extra Parent Price:</strong></Text>
						<Text style={{ fontSize: "16px", color: "black" }}>{formatCurrency(extraParentPrice)}</Text>
					</div>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
						<Text style={{ fontSize: "16px" }}>📊 <strong>Event Discount:</strong></Text>
						<Text style={{ fontSize: "16px", color: "#BB0000" }}>-{formatCurrency(eventDiscountPrice)}</Text>
					</div>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
						<Text style={{ fontSize: "16px" }}>📊 <strong>Membership Discount:</strong></Text>
						<Text style={{ fontSize: "16px", color: "#BB0000" }}>-{formatCurrency(membershipDiscount)}</Text>
					</div>
					<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
						<Text style={{ fontSize: "16px" }}>⚙️ <strong>Total Discount:</strong></Text>
						<Text style={{ fontSize: "16px", color: "#BB0000" }}>-{formatCurrency(eventDiscountPrice + membershipDiscount)}</Text>
					</div>
					<Divider />
					<Title level={3} style={{ color: "#FF7676" }}>💵 Total Cost: {formatCurrency(totalPrice)}</Title>
				</Card>

				{/* Vùng 4: Phương thức thanh toán */}
				<Card title={<Title level={3}>💳 Payment Method</Title>}>
					<div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
						<div
							onClick={() => setPaymentMethod("Cod")}
							style={{
								flex: 1,
								padding: "15px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: "8px",
								cursor: "pointer",
								boxShadow: paymentMethod === "Cod" ? "0px 0px 10px rgba(0, 0, 0, 0.2)" : "none",
								border: paymentMethod === "Cod" ? "2px solid #faad14" : "1px solid #ddd",
								background: paymentMethod === "Cod" ? "#fffbe6" : "#fff",
								transition: "all 0.3s ease-in-out"
							}}
						>
							<img src="https://icons.iconarchive.com/icons/aha-soft/business/256/credit-cards-icon.png" alt="COD" style={{ height: "22px", marginRight: "8px" }} />
							<Text style={{ fontSize: "16px" }}>COD</Text>
						</div>

						<div
							onClick={() => setPaymentMethod("Banking")}
							style={{
								flex: 1,
								padding: "15px",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								borderRadius: "8px",
								cursor: "pointer",
								boxShadow: paymentMethod === "Banking" ? "0px 0px 10px rgba(0, 0, 0, 0.2)" : "none",
								border: paymentMethod === "Banking" ? "2px solid #1890ff" : "1px solid #ddd",
								background: paymentMethod === "Banking" ? "#e6f7ff" : "#fff",
								transition: "all 0.3s ease-in-out"
							}}
						>
							<img src={banking} alt="Banking" style={{ height: "22px", marginRight: "8px" }} />
							<Text style={{ fontSize: "16px" }}>Banking</Text>
						</div>
					</div>
					{
						paymentMethod === "Banking" ?
							(
								<Alert message="Please check your information carefully before making payment. Purchased tickets cannot be refunded or reversed." type="warning" showIcon style={{ fontSize: "16px", marginTop: "12px" }} />
							) : (
								<Alert message="After Place Order, please bring your invoice to the playground to make a payment" type="warning" showIcon style={{ fontSize: "16px", marginTop: "12px" }} />
							)
					}
				</Card>

				{/* Nút điều hướng */}
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<Button type="default" danger style={{ fontSize: "16px", padding: "10px 20px" }} onClick={() => navigate(-1)}>
						Back to Order Information
					</Button>
					<Button style={{ backgroundColor: "#3B71CA", color: "white", fontSize: "16px", padding: "10px 20px" }} onClick={() => handlePlaceOrder(invoiceId)}>
						Place Order
					</Button>
				</div>
			</div>
		</div>
	);
};

export default UserPayment;
