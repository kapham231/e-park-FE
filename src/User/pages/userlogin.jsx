import Logo from "../../logo";
import { useAuth } from "../../auth/authContext";
import "../css/userlogin.css";
import {Alert, Button, Checkbox, Divider, Flex, Form, Input} from "antd";
import { LockOutlined, UserOutlined, EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {useState} from "react";

const UserLogin = () => {
	const auth = useAuth();
	const {loading, loginAction} = auth;
	const [form] = Form.useForm();
	const [errorMessage, setErrorMessage] = useState(null);
	const handleLogin = (data) => {
		loginAction({
			username: data.username,
			password: data.password,
			role: "Customer",
			remember: data.remember,
		}, (errorMessage) => handleError(errorMessage));
	};

	const handleError = (errorMessage) => {
		form.setFieldValue("password", "");
		setErrorMessage(errorMessage);
	}

	return (
		<div className="us-login-container">
			<div className="welcome-logo">
				<Logo />
			</div>

			<div className="login-modal">
				<div className="login-modal-content">
					<h1 className="login-text">Login</h1>
					<Form
						form={form}
						name="login"
						className="login-form"
						initialValues={{
							remember: true,
						}}
						onFinish={handleLogin}
					>
						<Form.Item
							name="username"
							rules={[
								{
									required: true,
									message: 'Please input your Username!',
								},
							]}
						>
							<Input prefix={<UserOutlined />} placeholder="Username" />
						</Form.Item>
						<Form.Item
							name="password"
							rules={[
								{
									required: true,
									message: 'Please input your Password!',
								},
							]}
						>
							<Input.Password
								prefix={<LockOutlined />}
								placeholder="Password"
								iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
							/>
						</Form.Item>
						{errorMessage ? (
							<Alert message={errorMessage ? errorMessage.toString() : "Unknow error has orcus!!"} type="error" showIcon style={{ marginBottom: 24 }} />
						) : null}
						<Form.Item>
							<Flex justify="space-between" align="center">
								<Form.Item name="remember" valuePropName="checked" noStyle>
									<Checkbox>Remember me</Checkbox>
								</Form.Item>
							</Flex>
						</Form.Item>
						<Form.Item>
							<Button block type="primary" htmlType="submit" loading={!!loading}>
								Log in
							</Button>
						</Form.Item>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default UserLogin;