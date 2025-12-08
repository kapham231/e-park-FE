import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";

const AddSupplierModal = ({ visible, onClose, onSubmit, initialValues }) => {
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
                onSubmit(values); // Gửi dữ liệu nhà cung cấp mới hoặc đã chỉnh sửa lên component cha
                form.resetFields(); // Reset form sau khi thêm hoặc chỉnh sửa thành công
                onClose(); // Đóng modal
            })
            .catch((info) => {
                console.error("Validate Failed:", info);
            });
    };

    return (
        <Modal
            title={initialValues ? "Edit Supplier" : "Add New Supplier"} // Đổi tiêu đề dựa trên chế độ
            visible={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {initialValues ? "Save Changes" : "Add Supplier"} {/* Đổi nút dựa trên chế độ */}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the supplier's name!" }]}
                >
                    <Input
                        placeholder="Enter supplier name"
                        onBlur={(e) => {
                            const value = e.target.value;
                            const sanitizedValue = value.replace(/\s{2,}/g, ' ').trim(); // Loại bỏ khoảng trắng thừa
                            form.setFieldValue('name', sanitizedValue); // Cập nhật giá trị vào form
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter the supplier's email!" },
                        { type: "email", message: "Please enter a valid email!" },
                    ]}
                >
                    <Input placeholder="Enter supplier email" />
                </Form.Item>
                <Form.Item
                    label="Phone"
                    name="phoneNumber"
                    rules={[{ required: true, message: "Please enter the supplier's phone number!" }]}
                >
                    <Input placeholder="Enter supplier phone number" />
                </Form.Item>
                <Form.Item
                    label="Logo URL"
                    name="logo"
                    rules={[{ required: true, message: "Please enter the logo URL!" }]}
                >
                    <Input placeholder="Enter logo URL" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddSupplierModal;