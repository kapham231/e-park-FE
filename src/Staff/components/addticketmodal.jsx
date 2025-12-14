import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';

const { Option } = Select;

const gradientOptions = [
    { label: 'Sunset Glow', value: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)' },
    { label: 'Purple Dream', value: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
    { label: 'Aqua Blue', value: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)' },
    { label: 'Ocean Wave', value: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)' },
    { label: 'Candy Pink', value: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)' },
    { label: 'Forest Green', value: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)' },
    { label: 'Neon Night', value: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)' },
    { label: 'Deep Space', value: 'linear-gradient(135deg, #434343 0%, black 100%)' },
    { label: 'Royal Gold', value: 'linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%)' },
    { label: 'Electric Violet', value: 'linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)' },
    { label: 'Emerald Wave', value: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)' },
];

const AddTicketModal = ({ isModalOpen, handleModalClose, handleSaveTicket, tickets, editingTicket }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingTicket) {
            form.setFieldsValue({
                ...editingTicket,
                price: editingTicket.price.toLocaleString("vi-VN"), // Định dạng giá khi chỉnh sửa
                bonus: editingTicket.bonus.toLocaleString("vi-VN"), // Định dạng giá khi chỉnh sửa
            });
        } else {
            form.resetFields();
        }
    }, [editingTicket, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            values.price = parseInt(values.price.replace(/\D/g, ""), 10); // Chuyển giá về số nguyên
            values.bonus = parseInt(values.bonus.replace(/\D/g, ""), 10); // Chuyển giá về số nguyên

            if (isNaN(values.price) || values.price <= 0) {
                message.error("Giá vé không hợp lệ!");
                return;
            }

            if (isNaN(values.bonus) || values.bonus <= 0) {
                message.error("Giá vé thêm không hợp lệ!");
                return;
            }

            // console.log(values);

            handleSaveTicket(values);
            form.resetFields();
        } catch (error) {
            console.error("Lỗi khi lưu vé:", error);
            message.error("Lỗi khi lưu vé. Vui lòng thử lại.");
        }
    };

    const checkTicketIconExists = (icon) => {
        return tickets.some(ticket => ticket.icon === icon);
    };

    return (
        <Modal
            title={editingTicket ? "Edit ticket" : "Add ticket"}
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleModalClose}
            okText={editingTicket ? "Save" : "Add"}
            centered
            styles={{
                body: {
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    padding: '24px 24px 0'
                }
            }}
        >
            <Form form={form} layout="vertical" name="ticket_form">
                <Form.Item
                    label="Ticket Type"
                    name="ticketType"
                    rules={[{ required: true, message: 'Please enter ticket type!' }]}
                >
                    <Input maxLength={11} placeholder="Enter ticket type" />
                </Form.Item>

                <Form.Item label="Ticket Price (VND)" name="price" rules={[{ required: true, message: "Please type ticket type!" }]}>
                    <Input
                        placeholder="Type Ticket Price"
                        onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ""); // Loại bỏ tất cả ký tự không phải số
                            form.setFieldsValue({ price: new Intl.NumberFormat("vi-VN").format(value) });
                        }}
                        suffix="VND"
                    />
                </Form.Item>

                <Form.Item label="Ticket Bonus Price (VND)" name="bonus" rules={[{ required: true, message: "Please type ticket bonus price!" }]}>
                    <Input
                        placeholder="Type Ticket Bonus Price"
                        onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ""); // Loại bỏ tất cả ký tự không phải số
                            form.setFieldsValue({ bonus: new Intl.NumberFormat("vi-VN").format(value) });
                        }}
                        suffix="VND"
                    />
                </Form.Item>

                <Form.Item label="Ticket Background" name="backgroundColor" rules={[{ required: true, message: "Please choose background!" }]}>
                    <Select placeholder="Choose Background">
                        {gradientOptions.map((option) => (
                            <Option key={option.value} value={option.value}>
                                <div
                                    style={{
                                        background: option.value,
                                        width: "100%",
                                        height: "30px",
                                        borderRadius: "5px",
                                    }}
                                />
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Icon"
                    name="icon"
                    rules={[{ required: true, message: 'Please select an icon!' }]}
                >
                    <Select placeholder="Select an icon">
                        <Option value="CrownOutlined" disabled={checkTicketIconExists("CrownOutlined")}>Crown</Option>
                        <Option value="StarOutlined" disabled={checkTicketIconExists("StarOutlined")}>Star</Option>
                        <Option value="SmileOutlined" disabled={checkTicketIconExists("SmileOutlined")}>Smile</Option>
                        <Option value="RocketOutlined" disabled={checkTicketIconExists("RocketOutlined")}>Rocket</Option>
                        <Option value="HeartOutlined" disabled={checkTicketIconExists("HeartOutlined")}>Heart</Option>
                        <Option value="FireOutlined" disabled={checkTicketIconExists("FireOutlined")}>Fire</Option>
                        <Option value="GiftOutlined" disabled={checkTicketIconExists("GiftOutlined")}>Gift</Option>
                        <Option value="TrophyOutlined" disabled={checkTicketIconExists("TrophyOutlined")}>Trophy</Option>
                        <Option value="MoonOutlined" disabled={checkTicketIconExists("MoonOutlined")}>Moon</Option>
                        <Option value="SunOutlined" disabled={checkTicketIconExists("SunOutlined")}>Sun</Option>
                        <Option value="ThunderboltOutlined" disabled={checkTicketIconExists("ThunderboltOutlined")}>Thunderbolt</Option>
                        <Option value="FlagOutlined" disabled={checkTicketIconExists("FlagOutlined")}>Flag</Option>
                        <Option value="CameraOutlined" disabled={checkTicketIconExists("CameraOutlined")}>Camera</Option>
                        <Option value="CloudOutlined" disabled={checkTicketIconExists("CloudOutlined")}>Cloud</Option>
                        <Option value="EnvironmentOutlined" disabled={checkTicketIconExists("EnvironmentOutlined")}>Environment</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddTicketModal;
