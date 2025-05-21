import React from "react";
import { Button, Typography, Popconfirm, InputNumber, Modal, Space } from "antd";
import {
    CrownOutlined,
    StarOutlined,
    SmileOutlined,
    RocketOutlined,
    HeartOutlined,
    FireOutlined,
    GiftOutlined,
    TrophyOutlined,
    MoonOutlined,
    SunOutlined,
    ThunderboltOutlined,
    FlagOutlined,
    CameraOutlined,
    CloudOutlined,
    EnvironmentOutlined,
} from "@ant-design/icons";
import { jsPDF } from "jspdf";
import logo from "../../Assets/img/logo.png"; // Đường dẫn đến hình ảnh logo
import "../css/ticket.css";
import { createTicketForNewMember } from "../../ApiService/adminApi";
import { getInvoice, updateInvoice } from "../../ApiService/userApi";

const { Text } = Typography;

const iconMap = {
    CrownOutlined: <CrownOutlined style={{ fontSize: "2rem", color: "#FFD700" }} />,
    StarOutlined: <StarOutlined style={{ fontSize: "2rem", color: "#FF69B4" }} />,
    SmileOutlined: <SmileOutlined style={{ fontSize: "2rem", color: "#87CEEB" }} />,
    RocketOutlined: <RocketOutlined style={{ fontSize: "2rem", color: "#FF6347" }} />,
    HeartOutlined: <HeartOutlined style={{ fontSize: "2rem", color: "#FF1493" }} />,
    FireOutlined: <FireOutlined style={{ fontSize: "2rem", color: "#FF4500" }} />,
    GiftOutlined: <GiftOutlined style={{ fontSize: "2rem", color: "#32CD32" }} />,
    TrophyOutlined: <TrophyOutlined style={{ fontSize: "2rem", color: "#DAA520" }} />,
    MoonOutlined: <MoonOutlined style={{ fontSize: "2rem", color: "#1E90FF" }} />,
    SunOutlined: <SunOutlined style={{ fontSize: "2rem", color: "#FFD700" }} />,
    ThunderboltOutlined: <ThunderboltOutlined style={{ fontSize: "2rem", color: "#FFA500" }} />,
    FlagOutlined: <FlagOutlined style={{ fontSize: "2rem", color: "#FF0000" }} />,
    CameraOutlined: <CameraOutlined style={{ fontSize: "2rem", color: "#8A2BE2" }} />,
    CloudOutlined: <CloudOutlined style={{ fontSize: "2rem", color: "#00BFFF" }} />,
    EnvironmentOutlined: <EnvironmentOutlined style={{ fontSize: "2rem", color: "#228B22" }} />,
};

const Ticket = ({ ticket, onEdit, onDelete }) => {
    const [visible, setVisible] = React.useState(false);
    const [quantity, setQuantity] = React.useState(1); // Số lượng vé
    const [bonus, setBonus] = React.useState(0);
    const handleCreateTicket = () => {
        setVisible(true); // hiện modal
        // generatePDF(ticket);
    }

    // Khi nhấn "OK" trong Modal
    const handleConfirm = async () => {
        const invoice = await createTicketForNewMember(ticket, quantity, bonus);
        // console.log(invoice);
        const invoiceData = await getInvoice(invoice.invoice.invoiceId);

        await updateInvoice(invoice.invoice.invoiceId, { ...invoiceData, status: "PAID" });
        console.log(invoiceData);
        generatePDF(invoiceData);
        setVisible(false);
        setBonus(0); // reset
    };

    const formatCurrencyForPDF = (amount) => {
        return amount.toLocaleString("vi-VN") + " VND";
    };

    const generatePDF = (invoiceData) => {
        // const doc = new jsPDF();
        // doc.setFont("helvetica", "bold");

        // const img = new Image();
        // img.src = logo;

        // img.onload = () => {
        //     const pageWidth = doc.internal.pageSize.getWidth();
        //     const margin = 20;
        //     let y = 20;

        //     // === LOGO ===
        //     doc.addImage(img, "PNG", margin, y, 30, 15);

        //     // === "PAID" Tag ===
        //     const tagWidth = 35;
        //     const tagHeight = 12;
        //     doc.setFillColor(46, 204, 113);
        //     doc.roundedRect(pageWidth - tagWidth - margin, y, tagWidth, tagHeight, 3, 3, 'F');
        //     doc.setTextColor(255, 255, 255);
        //     doc.setFontSize(12);
        //     doc.text("PAID", pageWidth - tagWidth / 2 - margin, y + 8, { align: "center" });

        //     y += 30;

        //     // === Title ===
        //     doc.setTextColor(0);
        //     doc.setFontSize(18);
        //     doc.text("Ticket Information", pageWidth / 2, y, { align: "center" });

        //     y += 10;

        //     // === Divider ===
        //     doc.setLineWidth(0.5);
        //     doc.setDrawColor(200);
        //     doc.line(margin, y, pageWidth - margin, y);

        //     y += 10;

        //     // === Ticket Info ===
        //     const ticketDetail = invoiceData.tickets[0];
        //     const labelX = margin;
        //     const valueX = pageWidth - margin;

        //     doc.setFontSize(12);
        //     const addRow = (label, value) => {
        //         doc.setTextColor(80, 80, 80);
        //         doc.text(label, labelX, y);
        //         doc.text(value, valueX, y, { align: "right" });
        //         y += 8;
        //     };

        //     // Basic info
        //     addRow("Type:", ticketDetail.ticketType.toUpperCase());
        //     addRow("Price:", formatCurrencyForPDF(ticketDetail.originalPrice));
        //     addRow("Quantity:", `${ticketDetail.quantity}`);

        //     if (ticketDetail.bonus > 0) {
        //         addRow("Bonus Price:", `${formatCurrencyForPDF(ticket.bonus)}`);
        //         addRow("Bonus:", `${ticketDetail.bonus}`);
        //     }


        //     // === Divider before totals ===
        //     y += 5;
        //     doc.line(margin, y, pageWidth - margin, y);
        //     y += 8;

        //     // Totals
        //     const totalTicketPrice = (ticketDetail.originalPrice - ticketDetail.priceAfterEventDiscount) * ticketDetail.quantity;
        //     addRow("Total Ticket Price:", formatCurrencyForPDF(totalTicketPrice));

        //     if (ticketDetail.bonus > 0) {
        //         addRow("Total Bonus Price:", formatCurrencyForPDF(ticket.bonus * bonus));
        //     }

        //     addRow("Discount:", `- ${formatCurrencyForPDF(ticketDetail.priceAfterEventDiscount)}`);

        //     // === Divider ===
        //     y += 3;
        //     doc.line(margin, y, pageWidth - margin, y);
        //     y += 8;

        //     // === Final Total ===
        //     doc.setFontSize(13);
        //     doc.setFont("helvetica", "bold");
        //     doc.setTextColor(0, 0, 0);
        //     addRow("TOTAL:", formatCurrencyForPDF(invoiceData.subtotal));

        //     // Save PDF
        //     doc.save(`ticket-${invoiceData.invoiceNumber}.pdf`);
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
        const statusText = "PAID";
        const statusColor = invoiceData.status === "PAID" ? [220, 53, 69] : [40, 167, 69]; // Xanh lá hoặc đỏ

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
        let startY = 60;
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Customer Information", 20, startY);
        startY += 10;
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        // doc.text(`Customer Name: ${invoiceData.name}`, 20, 70);
        // doc.text(`Phone: ${invoiceData.phone}`, 20, 78);
        // doc.text(`Email: ${invoiceData.email}`, 20, 86);
        doc.text(`Booking Date: ${today}`, 20, startY);
        startY += 8;
        doc.text(`Location: Central E-park, Vincom Vo Van Ngan, Thu Duc, Ho Chi Minh`, 20, startY);
        startY += 8;

        // Divider
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.line(20, startY, 190, startY);
        startY += 10;

        // Thông tin vé
        // let startY = 118;
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
        doc.text(`- ${formatCurrencyForPDF(invoiceData.tickets[0].priceAfterEventDiscount)}`, 190, startY, { align: "right" });
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
        <div className="ticket-wrapper">
            {/* <div className="ticket-cut-left"></div> */}
            <div className="ticket-content" style={{ background: ticket.backgroundColor }}>
                <Space>
                    <div className="ticket-icon">{iconMap[ticket.icon]}</div>
                    <Text className="ticket-text">{ticket.ticketType.toUpperCase()}</Text>
                </Space>
                <Space>
                    <Text className="ticket-price">{ticket.price.toLocaleString()} VND</Text>
                    {/* <Text className="ticket-price">{ticket.bonus.toLocaleString()} VND</Text> */}
                </Space>
                <Space size="middle">
                    <Button
                        type="primary"
                        shape="round"
                        size="small"
                        className="ticket-edit-button"
                        onClick={() => onEdit(ticket)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this ticket?"
                        onConfirm={() => onDelete(ticket)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            shape="round"
                            size="small"
                            className="ticket-delete-button"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                    {/* Nút tạo PDF */}
                    <Button
                        type="default"
                        shape="round"
                        size="small"
                        className="ticket-pdf-button"
                        onClick={() => handleCreateTicket()}
                    >
                        Create
                    </Button>
                </Space>
            </div>
            <div className="ticket-cut-right"></div>


            {/* Modal nhập số phụ huynh */}
            <Modal
                title="Ticket Information"
                open={visible}
                onOk={handleConfirm}
                onCancel={() => setVisible(false)}
                okText="Create"
                cancelText="Cancel"
            >
                <p>Quantity:</p>
                <InputNumber min={1} value={quantity} onChange={(value) => setQuantity(value)} />
                <span style={{ marginLeft: "12px", fontWeight: "bold", color: "#1890ff" }}>
                    x {ticket.price.toLocaleString()} VND
                </span>
                <br />

                <p className="mt-2">Bonus Parent:</p>
                <InputNumber min={0} max={5} value={bonus} onChange={(value) => setBonus(value)} />
                <span style={{ marginLeft: "12px", fontWeight: "bold", color: "#1890ff" }}>
                    x {ticket.bonus.toLocaleString()} VND
                </span>
            </Modal>
        </div>
    );
};

export default Ticket;