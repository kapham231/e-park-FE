import { useState, useEffect } from "react";
import { Modal, Form, Input, InputNumber, Select } from "antd";

import { getAllProductType, getAllSupplier } from "../../ApiService/playgroundmanagerApi";

const ProductModal = ({ visible, onClose, onSubmit, initialValues }) => {
    const [form] = Form.useForm();
    const [productTypes, setProductTypes] = useState([]);
    const [supplierList, setSupplierList] = useState([]);
    useEffect(() => {
        const fetchProductTypes = async () => {
            // Fetch product types from the API or context
            const response = await getAllProductType();
            console.log(response);
            // Assuming response is an array of product types
            setProductTypes(response.map(type => ({ label: type.typeName, value: type.typeName })));
        }

        fetchProductTypes();
    }, []);

    useEffect(() => {
        const fetchSupplier = async () => {
            // Fetch product types from the API or context
            const response = await getAllSupplier();
            // console.log(response);
            // Assuming response is an array of product types
            setSupplierList(response.map(supplier => ({ label: supplier.name, value: supplier._id })));
        }

        fetchSupplier();
    }, []);


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
            okText={initialValues ? "Modify" : "Add"}
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
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please input the product description!" }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    name="background"
                    label="Background Image URL"
                    rules={[{ required: true, message: "Please input the background image URL!" }]}
                >
                    <>
                        <Input />
                        {initialValues?.background && (
                            <div style={{ marginTop: 8 }}>
                                <img
                                    src={initialValues.background}
                                    alt="Background Preview"
                                    style={{ maxWidth: "200px", border: "1px solid #ddd", borderRadius: 4 }}
                                />
                            </div>
                        )}
                    </>
                </Form.Item>

                <Form.Item
                    name="quantity"
                    label="Quantity"
                    rules={[{ required: true, message: "Please input the quantity!" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                    name="purchasePrice"
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

                <Form.Item
                    name="supplierId"
                    label="Supplier"
                    rules={[{ required: true, message: "Please select the supplier!" }]}
                >
                    <Select placeholder="Select supplier" options={supplierList} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductModal;
