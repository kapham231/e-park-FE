import { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";

const ProductTypeModal = ({ visible, onClose, onSubmit, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
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
            title={initialValues ? "Edit Device Type" : "Add Device Type"}
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText={initialValues ? "Update" : "Add"}
            cancelText="Cancel"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="typeName"
                    label="Type Name"
                    rules={[{ required: true, message: 'Please input the type name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="code"
                    label="Type Code"
                    rules={[{ required: true, message: 'Please input the type code!' }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ProductTypeModal;
