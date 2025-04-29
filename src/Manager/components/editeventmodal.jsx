import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker, Image } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const EditEventModal = ({ open, onClose, onSave, initialValues }) => {
    const [form] = Form.useForm();
    const [backdropPreview, setBackdropPreview] = useState("");

    useEffect(() => {
        if (initialValues) {
            console.log(dayjs(initialValues.startDate, "DD-MM-YYYY HH:mm"));
            form.setFieldsValue({
                eventname: initialValues.eventTitle,
                dateRange: [
                    dayjs(initialValues.startDate, "DD-MM-YYYY HH:mm"),
                    dayjs(initialValues.endDate, "DD-MM-YYYY HH:mm"),
                ],
                description: initialValues.eventDescription,
                backdrop: initialValues.backdrop,
                // location: initialValues.location,
                discount: initialValues.discountRate,
            });
            setBackdropPreview(initialValues.backdrop || "");
        }
    }, [initialValues, form]);

    const handleBackdropChange = (e) => {
        setBackdropPreview(e.target.value);
    };

    const handleSave = () => {
        const values = form.validateFields().then((values) => {
            const [start, end] = values.dateRange;
            onSave({
                ...initialValues,
                eventTitle: values.eventname,
                startDate: start.toISOString(),
                endDate: end.toISOString(),
                eventDescription: values.description,
                // location: values.location,
                backdrop: values.backdrop,
                discountRate: values.discount
            });
            // form.resetFields();
            setBackdropPreview("");
        });

        console.log(values)
    };

    return (
        <Modal
            title="Edit Event"
            open={open}
            centered
            styles={{
                body: {
                    maxHeight: '70vh',
                    overflowY: 'auto',
                    padding: '24px 24px 0'
                }
            }}
            onCancel={onClose}
            onOk={handleSave}
            okText="Save"
            cancelText="Cancel"
        >
            <Form layout="vertical" form={form}>
                <Form.Item
                    label="Event Name"
                    name="eventname"
                    rules={[{ required: true, message: "Please input event name!" }]}
                >
                    <Input placeholder="Enter event name..." />
                </Form.Item>
                <Form.Item
                    label="Date Range"
                    name="dateRange"
                    rules={[{ required: true, message: "Please select date range!" }]}
                >
                    <RangePicker showTime format="DD-MM-YYYY HH:mm" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: "Please input description!" }]}
                >
                    <Input.TextArea placeholder="Enter event description..." rows={3} />
                </Form.Item>
                {/* <Form.Item
                    label="Event Location"
                    name="location"
                    rules={[{ required: true, message: "Please input event location!" }]}
                >
                    <Input placeholder="Enter event location..." />
                </Form.Item> */}
                <Form.Item
                  label="Backdrop URL"
                  name="backdrop"
                  rules={[
                    { required: true, message: "Please input backdrop URL!" },
                    {
                      type: "url",
                      message: "Please enter a valid URL (must start with http:// or https://)"
                    }
                  ]}
                >
                  <Input placeholder="Paste backdrop image URL..." onChange={handleBackdropChange} />
                </Form.Item>
                {backdropPreview && (
                    <div style={{ textAlign: "center", marginTop: 10 }}>
                        <Image src={backdropPreview} alt="Backdrop Preview" width={250} style={{ borderRadius: 8 }} />
                    </div>
                )}
                <Form.Item
                    label="Discount"
                    name="discount"
                    rules={[{ required: true, message: "Please input discount rates!" }]}
                >
                    <Input type="number" placeholder="Enter discount rates..." addonAfter="%" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditEventModal;