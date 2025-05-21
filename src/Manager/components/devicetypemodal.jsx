import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, InputNumber } from "antd";
import { getAllSupplier } from "../../ApiService/playgroundmanagerApi";

const { Option } = Select;

const DeviceTypeModal = ({ visible, onClose, onSubmit, initialValues }) => {
    const [form] = Form.useForm();

    // Khi `initialValues` thay đổi, cập nhật giá trị trong form
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields(); // Reset form nếu không có giá trị ban đầu
        }
    }, [initialValues, form]);

    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                console.log("Form values:", values); // In ra giá trị form để kiểm tra

                onSubmit(values); // Gửi dữ liệu thiết bị mới hoặc đã chỉnh sửa lên component cha
                form.resetFields(); // Reset form sau khi thêm hoặc chỉnh sửa thành công
                onClose(); // Đóng modal
            })
            .catch((info) => {
                console.error("Validate Failed:", info);
            });
    };

    return (
        <Modal
            title={initialValues ? "Edit Device Type" : "Add New Device Type"}
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {initialValues ? "Save Changes" : "Add Device Type"}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Type name"
                    name="typeName"
                    rules={[{ required: true, message: "Please enter the device type name!" }]}
                >
                    <Input
                        placeholder="Enter device type name"
                        onBlur={(e) => {
                            const value = e.target.value;
                            const sanitizedValue = value.replace(/\s{2,}/g, " ").trim(); // Loại bỏ khoảng trắng thừa
                            form.setFieldValue("typeName", sanitizedValue); // Cập nhật giá trị vào form
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Type code"
                    name="code"
                    rules={[{ required: true, message: "Please enter the device type code!" }]}
                >
                    <Input
                        placeholder="Enter device type code"
                        onChange={(e) => {
                            const value = e.target.value;
                            const sanitizedValue = value.replace(/\s/g, " ").trim(); // Loại bỏ khoảng trắng thừa
                            form.setFieldValue("code", sanitizedValue); // Cập nhật giá trị vào form
                        }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DeviceTypeModal;