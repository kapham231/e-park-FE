import { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";

const ProductTypeModal = ({ visible, onClose, onSubmit, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.setFieldsValue({ quantity: 0 }); // Default value when adding
        }
    }, [initialValues, form, visible]);

    const handleOk = () => {
        form.validateFields().then((values) => {
            const finalValues = {
                ...values,
                quantity: initialValues ? values.quantity : 0, // Always ensure quantity = 0 if adding
            };
            onSubmit(finalValues);
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
            title={initialValues ? "Edit Device Type" : "Add Device Type"}
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={initialValues ? "Update" : "Add"}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Type Name"
                    rules={[{ required: true, message: 'Please input the type name!' }]}
                >
                    <Input />
                </Form.Item>

                {initialValues && (
                    <Form.Item
                        name="quantity"
                        label="Quantity"
                        rules={[{ required: true, message: 'Please input the quantity!' }]}
                    >
                        <InputNumber min={0} />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
};

export default ProductTypeModal;
