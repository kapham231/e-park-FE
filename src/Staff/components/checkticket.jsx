import React, { useState } from 'react';
import { Button, Input, message, Card, Tag, Row, Col, List } from 'antd';
import { changeInvoiceStatus, findInvoice } from '../../ApiService/userApi';
import { getUserNameById } from '../../ApiService/adminApi';
import Title from 'antd/es/typography/Title';
import { getEventByDate } from "../../ApiService/playgroundmanagerApi";
import useCheckMobile from "../../hooks/useCheckMobile";

const CheckTicket = () => {
    const isMobile = useCheckMobile();
    const [invoiceOderCode, setInvoiceOrderCode] = useState('');
    const [invoice, setInvoice] = useState(null);
    const [events, setEvents] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [loading, setLoading] = useState(false);

    // Function to format currency Vietnamese style
    const formatCurrency = (value) => {
        return value.toLocaleString("vi-VN") + " VND";
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            const invoice = await findInvoice(invoiceOderCode);
            console.log("invoice: ", invoice);
            const events = await getEventByDate(invoice.bookingDate);
            console.log("event: ", events.data);

            const customer = await getUserNameById(invoice.customer);
            console.log("customer: ", customer);

            const customerName = `${customer.firstName} ${customer.lastName}`;
            console.log("customerName: ", customerName);

            setCustomerName(customerName);
            setInvoice(invoice);
            setEvents(events.data);
        } catch (error) {
            message.error('Invoice not found');
            setInvoice(null);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPayment = async () => {
        try {
            await changeInvoiceStatus(invoice._id);
            message.success('Payment confirmed!');
            setInvoice(prev => ({ ...prev, status: 'PAID' }));
        } catch (error) {
            message.error('Failed to confirm payment');
        }
    };

    const renderStatusTag = (status) => {
        const color = status === 'PAID' ? 'green' : 'blue';
        return <Tag color={color}>{status}</Tag>;
    };

    return (
        <div style={{ padding: isMobile ? '8px' : '24px', margin: 'auto' }}>
            <Row justify="center">
                <Col xs={22} sm={20} md={16} lg={12} xl={10}>
                    <Title level={2} style={{ textAlign: 'center', marginTop: 32 }}>
                        Check Ticket
                    </Title>
                    <Input.Search
                        placeholder="Enter invoice order code"
                        value={invoiceOderCode}
                        onChange={e => setInvoiceOrderCode(e.target.value)}
                        onSearch={handleSearch}
                        loading={loading}
                        enterButton="Search"
                        style={{ width: '100%', marginBottom: 20 }}
                    />
                </Col>
            </Row>

            {invoice && (
                <Row gutter={[16, 16]} justify="center" style={{ marginTop: 20 }}>
                    <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                        <Card>
                            <Title level={4}>Invoice #{invoice.invoiceNumber}</Title>
                            <p><strong>Customer:</strong> {invoice.customer}</p>
                            <p><strong>Customer Name:</strong> {customerName}</p>
                            <p><strong>Status:</strong> {renderStatusTag(invoice.status)}</p>
                            <p><strong>Ticket Quantity:</strong></p>
                            <ul>
                                {invoice.tickets.map((ticket, index) => (
                                    <React.Fragment key={index}>
                                        <li>{ticket.ticketType} - {ticket.quantity} tickets</li>
                                        {ticket.bonus > 0 && (
                                            <li>Bonus for this Type: {ticket.bonus} parent</li>
                                        )}
                                    </React.Fragment>
                                ))}
                            </ul>
                            <p><strong>Total Price:</strong> {formatCurrency(invoice.subtotal)}</p>
                            {invoice.status !== 'PAID' && (
                                <Button
                                    style={{ color: 'white', backgroundColor: '#3b71ca', marginTop: 10 }}
                                    onClick={handleConfirmPayment}
                                >
                                    Confirm Payment
                                </Button>
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                        {events.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={events}
                                renderItem={event => (
                                    <Card>
                                        <List.Item>
                                            <List.Item.Meta
                                                title={event.eventTitle}
                                                description={
                                                    <>
                                                        <span><strong>Start date:</strong> {event.startDate}</span>
                                                        <p><strong>End date:</strong> {event.endDate}</p>
                                                    </>
                                                }
                                            />
                                        </List.Item>
                                    </Card>
                                )}
                            />
                        ) : (
                            <Card>
                                <p>No events found for this invoice.</p>
                            </Card>
                        )}
                    </Col>
                </Row>
            )}
        </div>
    );
};

export default CheckTicket;
