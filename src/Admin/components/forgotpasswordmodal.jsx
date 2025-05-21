import Form from "antd/es/form/Form";
import { handleRecoverPassword } from "../../ApiService/adminApi";
import { useEffect, useState } from "react";
import { Button, Input, Modal } from "antd";



const ForgotPasswordModal = ({ visible, onClose, initialValues }) => {
    const [form] = Form.useForm();
    const [tmppassword, setTmppassword] = useState("");

    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                username: initialValues.username,
                tmppassword: "",
            });
            setTmppassword(""); // Reset mật khẩu tạm thời
        }
    }, [initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields(); // Xác thực form
            console.log("Form values:", values);

            // Gọi API để gửi mật khẩu tạm thời
            const newPassword = await handleRecoverPassword(initialValues.username, tmppassword);
            alert("Your password has been changed to: " + newPassword.tempPassword);



            // Reset form và đóng modal
            form.resetFields();
        } catch (error) {
            console.error("Validate Failed or API Error:", error);
        }
    }

    return (
        <Modal
            title="Forgot Password"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Username"
                    name="username"
                    initialValue={initialValues?.username}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Temporary Password"
                    name="tmppassword"
                    rules={[{ required: true, message: "The new password must be at least 6 characters", min: 6 }]}
                >
                    <Input
                        placeholder="Enter your temporary password"
                        value={tmppassword}
                        onChange={(e) => setTmppassword(e.target.value)}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ForgotPasswordModal;