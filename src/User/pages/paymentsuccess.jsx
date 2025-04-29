import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button, Divider } from "antd";
import React, { useEffect, useState } from "react";

import "../css/paymentsuccess.css"
import { changeInvoiceStatus, findInvoice, getInvoice } from "../../ApiService/userApi";
import jsPDF from "jspdf";
import { useAuth } from "../../auth/authContext";
import logo from "../../Assets/img/logo.png";

const PaymentSuccess = () => {
	const navigate = useNavigate();
	const [invoice, setInvoice] = useState(null);
	const [membershipDiscount, setMembershipDiscount] = useState(0);
	const [eventDiscountPrice, setEventDiscountPrice] = useState(0);
	const { user } = useAuth();

	const [searchParams, setSearchParams] = useSearchParams();
	useEffect(() => {

		const fetchInvoice = async () => {
			try {
				console.log(searchParams.get("orderCode"));

				const invoice = await findInvoice(searchParams.get("orderCode"));
				console.log(invoice);

				await changeInvoiceStatus(invoice._id);
				// console.log(orderCode);


				if (invoice) {
					setInvoice(invoice);
					const a = (parseInt(invoice.membershipDiscount) / 100) * ((invoice.tickets[0].originalPrice - invoice.tickets[0].priceAfterEventDiscount) * invoice.tickets[0].quantity +
						invoice.tickets[0].bonusAmount);
					const b = invoice.tickets[0].priceAfterEventDiscount * invoice.tickets[0].quantity
					console.log(a, b);
					setMembershipDiscount(a);
					setEventDiscountPrice(b);
				}

			} catch (error) {
				console.error("Error fetching invoice:", error);
			}
		}

		fetchInvoice();
	}, []);

	const paymentAmountTransform = (amount) => {
		if (amount) {
			return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		return 0;
	}

	const formatISOTime = (time) => {
		return new Date(time).toLocaleString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	}

	const formatCurrency = (amount) => {
		return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
	};

	const formatCurrencyForPDF = (amount) => {
		return amount.toLocaleString("vi-VN") + " VND";
	};

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
		doc.text(`Date: ${today}`, 165, 45);

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
		doc.text(`Customer Name: ${user?.firstName + " " + user?.lastName}`, 20, 70);
		doc.text(`Phone: ${user?.phoneNumber}`, 20, 78);
		doc.text(`Email: ${user?.email}`, 20, 86);

		// Divider
		doc.setDrawColor(0);
		doc.setLineWidth(0.5);
		doc.line(20, 92, 190, 92);

		// Thông tin vé
		let startY = 100;
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

		// Xuất file PDF
		doc.save(`invoice_${invoiceData.invoiceNumber}.pdf`);
	};

	return (
		<div className="payment-success-wrapper">
			<CircleCheckIcon className="payment-success-icon" />
			<h1 className="payment-success-header">Payment Successful</h1>
			<p className="payment-success-subtext">Thank you for your purchase!</p>
			<div className="payment-success-details">
				<p className="helper-text">

				</p>
				<Button onClick={() => generatePDF(invoice)} type="primary" className="download-invoice-button">
					Download Invoice
				</Button>
			</div>
			<div className="payment-success-details">
				<div className="payment-success-item">
					<span>Amount Paid:</span>
					<span className="item-value">{paymentAmountTransform(invoice?.subtotal)} VND</span>
				</div>
				<div className="payment-success-item">
					<span>Date & Time:</span>
					<span className="item-value">{formatISOTime(invoice?.createdAt)}</span>
				</div>
			</div>
			<Button
				type="primary"
				style={{ marginTop: "20px" }}
				onClick={() => navigate("/user/homepage")}
			>
				Back to Homepage
			</Button>
		</div>
	);
};

function CircleCheckIcon(props) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<path d="m9 12 2 2 4-4" />
		</svg>
	)
}

export default PaymentSuccess;