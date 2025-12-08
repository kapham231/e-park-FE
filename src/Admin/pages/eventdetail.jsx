import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Typography, Image, FloatButton } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const EventDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const event = location.state?.event;

    if (!event) {
        return <p>No event details available.</p>;
    }

    return (
        <Card style={{ maxWidth: 800, margin: "auto", marginTop: 20 }}>
            <Title level={2}>{event.eventname}</Title>
            <Paragraph><strong>Start Date:</strong> {event.startdate}</Paragraph>
            <Paragraph><strong>End Date:</strong> {event.enddate}</Paragraph>
            <Paragraph><strong>Description:</strong> {event.description}</Paragraph>
            {event.backdrop && (
                <Image src={event.backdrop} alt="Backdrop" width={400} />
            )}
            <FloatButton
                icon={<ArrowLeftOutlined />}
                type="primary"
                onClick={() => navigate(-1)}
            />
        </Card>
    );
};

export default EventDetail;
