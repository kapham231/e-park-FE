import { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

const ProductModal = ({ visible, onClose, onSubmit, initialValues }) => {
    const [form] = Form.useForm();
    const productTypes = [
        { label: "Food", value: "food" },
        { label: "Drink", value: "drink" },
        { label: "Snack", value: "snack" },
    ]

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form, visible]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            onSubmit(values);
            form.resetFields();
            onClose();
        });
    };

    const handleCancel = () => {
        form.resetFields();
        onClose();
    };

    return (
        <Modal
            title={initialValues ? "Edit Product" : "Add Product"}
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={initialValues ? "Update" : "Add"}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true, message: "Please input the product name!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="typeName"
                    label="Product Type"
                    rules={[{ required: true, message: "Please select a product type!" }]}
                >
                    <Select placeholder="Select a type" options={productTypes} />
                </Form.Item>

                <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, message: "Please input the quantity!" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    name="salePrice"
                    label="Sale Price"
                    rules={[{ required: true, message: "Please input the sale price!" }]}
                >
                    <InputNumber
                        min={0}
                        formatter={(value) =>
                            value ? `${Number(value).toLocaleString("vi-VN")} VND` : ""
                        }
                        parser={(value) =>
                            value ? value.replace(/[^\d]/g, "") : ""
                        }
                        style={{ width: "100%" }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductModal;
