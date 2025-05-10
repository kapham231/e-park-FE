import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, InputNumber } from "antd";
import { getAllSupplier, getAllType } from "../../ApiService/playgroundmanagerApi";

const { Option } = Select;

const DeviceModal = ({ visible, onClose, onSubmit, initialValues }) => {
    const [form] = Form.useForm();
    const [suppliersList, setSuppliersList] = useState([]);
    const [typeList, setTypeList] = useState([]);

    // Khi `initialValues` thay đổi, cập nhật giá trị trong form
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields(); // Reset form nếu không có giá trị ban đầu
        }

        fetchSuppliersList(); // Lấy danh sách nhà cung cấp khi modal mở
        fetchTypeList();
    }, [initialValues, form]);

    const fetchSuppliersList = async () => {
        // Giả lập API để lấy danh sách nhà cung cấp
        const tempSuppliersList = await getAllSupplier();
        if (tempSuppliersList.length === 0) {
            console.log("No suppliers found");
            return;
        }
        setSuppliersList(tempSuppliersList);
    };
    const fetchTypeList = async () => {
        // Giả lập API để lấy danh sách nhà cung cấp
        const tempTypeList = await getAllType();
        if (tempTypeList.length === 0) {
            console.log("No types found");
            return;
        }
        setTypeList(tempTypeList);
    };


    const handleSubmit = () => {
        form.validateFields()
            .then((values) => {
                // console.log("Form values:", values); 

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
            title={initialValues ? "Edit Device" : "Add New Device"} // Đổi tiêu đề dựa trên chế độ
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={handleSubmit}>
                    {initialValues ? "Save Changes" : "Add Device"} {/* Đổi nút dựa trên chế độ */}
                </Button>,
            ]}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Supplier"
                    name="supplierId"
                    rules={[{ required: true, message: "Please select a supplier!" }]}
                >
                    <Select placeholder="Select a supplier">
                        {suppliersList.map((supplier) => (
                            <Option key={supplier._id} value={supplier._id}>
                                {supplier.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Type"
                    name="typeName"
                    rules={[{ required: true, message: "Please select a device type!" }]}
                >
                    <Select placeholder="Select a device type">
                        {typeList.map((type) => (
                            <Option key={type._id} value={type.typeName}>
                                {type.typeName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="purchasePrice"
                    rules={[{ required: true, message: "Please select the device price!" }]}
                >
                    <InputNumber
                        placeholder="Enter device price"
                        style={{ width: "100%" }}
                        addonAfter="VND" // Hiển thị "VND" cố định ở cuối khung nhập
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} // Định dạng số với dấu phẩy
                        parser={(value) => value.replace(/(,*)/g, "")} // Loại bỏ dấu phẩy khi nhập
                        min={0}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default DeviceModal;