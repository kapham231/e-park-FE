import React, { useEffect, useState } from "react";
import { Button, Card, DatePicker, Descriptions, Divider, Empty, Flex, List, Modal, Select, Typography } from "antd";
import useCheckMobile from "../../hooks/useCheckMobile";
import { getAllEvent, getOngoingEvent, getUpcomingEvent } from "../../ApiService/playgroundmanagerApi";
import moment from "moment";

const { Title, Text } = Typography;

const EventContent = () => {
    const isMobile = useCheckMobile();
    // const [events] = useState([
    //     {id: 1, name: "Sự kiện A", date: "2024-02-10", area: "A32", time: "08:00", description: "Mô tả sự kiện A"},
    //     {id: 2, name: "Sự kiện B", date: "2024-02-12", area: "A33", time: "09:00", description: "Mô tả sự kiện B"},
    //     {id: 3, name: "Sự kiện C", date: "2024-02-15", area: "A34", time: "10:00", description: "Mô tả sự kiện C"},
    // ]);

    const [events, setEvents] = useState([]);
    const [typeFilter, setTypeFilter] = useState("all");
    const [filterRange, setFilterRange] = useState(null);

    useEffect(() => {
        switch (typeFilter) {
            case "upcoming":
                getUpcomingEvent()
                    .then((res) => {
                        setEvents(res.data);
                    });
                break;
            case "ongoing":
                getOngoingEvent()
                    .then((res) => {
                        setEvents(res.data);
                    });
                break;
            default:
                getAllEvent()
                    .then((events) => {
                        setEvents(events);
                    });
        }
    }, [typeFilter]);

    const filterEventsByDate = events.filter(event => {
        const eventStartDate = moment(event.startDate, "DD-MM-YYYY");
        const eventEndDate = moment(event.endDate, "DD-MM-YYYY");
        if (!filterRange) return true;
        return eventStartDate.isBetween(filterRange[0], filterRange[1], null, '[]') || eventEndDate.isBetween(filterRange[0], filterRange[1], null, '[]');
    })

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showEventDetails = (event) => {
        setSelectedEvent(event);
        setIsModalVisible(true);
    };

    return (
        <div style={{ margin: "auto", padding: 20 }}>
            <Title level={2}>Event List</Title>

            <Flex justify={"flex-start"} align={"center"} gap={20}>
                <DatePicker.RangePicker
                    onChange={(d) => {
                        if (d) setFilterRange([moment(d[0].toDate(), "DD-MM-YYYY"), moment(d[1].toDate(), "DD-MM-YYYY")])
                        else setFilterRange(null)
                    }}
                    format="DD-MM-YYYY"
                />
                <Select
                    value={typeFilter}
                    onChange={setTypeFilter}
                    options={[
                        { value: "all", label: "All" },
                        { value: "upcoming", label: "Upcoming" },
                        { value: "ongoing", label: "Ongoing" },
                    ]}
                    style={{ width: "120px" }}
                />
            </Flex>

            <Divider />

            {filterEventsByDate.length === 0 ? (
                <Card style={{ textAlign: "center", padding: 30, borderRadius: 10 }}>
                    <Empty description="You don't have any events" />
                </Card>
            ) : (
                <List
                    bordered
                    dataSource={filterEventsByDate}
                    renderItem={(event) => (
                        <List.Item
                            style={{
                                borderRadius: 8,
                                marginBottom: 8,
                                padding: "16px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",  // Đảm bảo khoảng cách giữa nội dung và nút
                                minHeight: 40 // Giữ chiều cao đồng đều cho các ô 
                            }}
                        >
                            <div>
                                <Text strong>{event.eventTitle}</Text> {!isMobile ? (<Text type="secondary"> - {event.eventDescription}</Text>) : ""}
                            </div>
                            <Button
                                onClick={() => showEventDetails(event)}
                                style={{ alignSelf: "flex-start", backgroundColor: "#3b71ca", color: "white" }} // Đảm bảo căn lề đúng
                            >
                                Detail
                            </Button>
                        </List.Item>
                    )}
                />)
            }

            {/* Modal hiển thị chi tiết sự kiện */}
            <Modal
                title="Event Detail"
                open={isModalVisible}
                style={{
                    top: isMobile ? 60 : ""
                }}
                centered={!isMobile}
                onCancel={() => setIsModalVisible(false)}
                footer={[<Button key="close" onClick={() => setIsModalVisible(false)}>Close</Button>]}
            >
                {selectedEvent ? (
                    <Descriptions bordered column={1}>
                        <Descriptions.Item label="Event Name">{selectedEvent.eventTitle}</Descriptions.Item>
                        <Descriptions.Item label="Start Date">{selectedEvent.startDate}</Descriptions.Item>
                        <Descriptions.Item label="End Date">{selectedEvent.endDate}</Descriptions.Item>
                        {/* <Descriptions.Item label="Location">{selectedEvent.location}</Descriptions.Item> */}
                        <Descriptions.Item label="Description">{selectedEvent.eventDescription}</Descriptions.Item>
                        <Descriptions.Item label="Discount Rate">{selectedEvent.discountRate}%</Descriptions.Item>
                    </Descriptions>
                ) : ""}
            </Modal>
        </div>
    );
};

export default EventContent;
