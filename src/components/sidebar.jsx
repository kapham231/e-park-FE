import React, { useEffect } from 'react';
import {
	BugOutlined,
	ContainerOutlined,
	FundViewOutlined,
	LogoutOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	ToolOutlined,
	UserOutlined,
	SolutionOutlined,
	ProductOutlined
} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import UserManagementContent from '../Admin/components/usermanagementcontent';
import ReportErrorContent from '../Staff/components/reportcontent';
import EventContent from '../Staff/components/eventcontent';
import EventManagementContent from '../Manager/components/eventmanagement';
import EventDetail from '../Manager/pages/eventdetail';
import DeviceManagementContent from '../Manager/components/devicemanagement';
// import ManagerDashboardContent from '../Manager/components/dashboard';
import ReportContent from '../Manager/components/report';
import useCheckMobile from "../hooks/useCheckMobile";
import TicketManagementContent from '../Admin/components/ticketmanagementcontent';
import CheckTicket from '../Staff/components/checkticket';
import { useAuth } from "../auth/authContext";
import ProductManagement from '../Manager/pages/productmanagement';

const { Header, Content, Sider } = Layout;
const roleBasedItems = {
	admin: [
		{ key: '/admin/user-management', icon: <UserOutlined />, label: 'User Management' },
		{ key: '/admin/ticket-management', icon: <SolutionOutlined />, label: 'Ticket Management' },
		{ key: 'logout', icon: <LogoutOutlined />, label: 'Logout', style: { color: 'red' } },
	],
	staff: [
		{ key: '/staff/event', icon: <ContainerOutlined />, label: 'Event' },
		{ key: '/staff/report-error', icon: <BugOutlined />, label: 'Report Error' },
		{ key: '/staff/check-ticket', icon: <SolutionOutlined />, label: 'Check Ticket' },
		{ key: 'logout', icon: <LogoutOutlined />, label: 'Logout', style: { color: 'red' } },
	],
	manager: [
		{ key: '/manager/event-management', icon: <ContainerOutlined />, label: 'Event' },
		{ key: '/manager/device-management', icon: <ToolOutlined />, label: 'Device Management' },
		// { key: '/manager/manager-dashboard', icon: <AreaChartOutlined />, label: 'Dashboard' },
		{ key: '/manager/product-management', icon: <ProductOutlined />, label: 'Product Management' },
		{ key: '/manager/report', icon: <FundViewOutlined />, label: 'Report' },
		{ key: 'logout', icon: <LogoutOutlined />, label: 'Logout', style: { color: 'red' } },
	],
	// Add other roles if necessary
};
const Sidebar = ({ role }) => {
	const auth = useAuth();
	const isMobile = useCheckMobile();
	const navigate = useNavigate();
	const location = useLocation();
	const items = roleBasedItems[role];
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();
	const [collapsed, setCollapsed] = React.useState(false);
	const [selectedKey, setSelectedKey] = React.useState('');

	// React.useEffect(() => {
	//     const defaultKey = items[0]?.key || '';
	//     if (!location.pathname || location.pathname === `/${role}`) {
	//         setSelectedKey(defaultKey);
	//         navigate(defaultKey);
	//     } else {
	//         setSelectedKey(location.pathname);
	//     }
	// }, [location, navigate, role, items]);

	useEffect(() => {
		const basePath = location.pathname.startsWith("/manager/event-management")
			? "/manager/event-management"
			: location.pathname;

		setSelectedKey(basePath);
	}, [location]);

	const handleMenuClick = ({ key }) => {
		if (key === 'logout' && (role === 'admin' || role === 'staff' || role === 'manager')) {
			auth.logOut();
			// navigate('/');
			return;
		}
		setSelectedKey(key);
		navigate(key); // Navigate based on role and key
		setCollapsed(true);
	};
	// console.log(roleBasedItems[role][0].key);

	return (
		<Layout
			style={{
				position: 'relative',
				height: "max(100vh, 100%)"
			}}
		>
			<Sider
				breakpoint="lg"
				collapsedWidth={isMobile ? "0" : "60"}
				style={{
					height: isMobile ? "100%" : "",
					position: isMobile ? "absolute" : "relative",
					top: 0,
					left: 0,
					zIndex: 3,
				}}
				trigger={null}
				collapsible
				collapsed={collapsed}
			>
				<div className="demo-logo-vertical" />

				<Button
					type="text"
					icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
					onClick={() => setCollapsed(!collapsed)}
					style={{
						fontSize: '16px',
						width: 64,
						height: 64,
						position: 'absolute',
						right: -64,
						top: 0,
						zIndex: 1,
					}}
				/>

				<Menu theme="dark" mode="inline" selectedKeys={[selectedKey]} items={items} onClick={handleMenuClick} />
			</Sider>
			<Layout>
				<Header
					style={{
						padding: 0,
						background: colorBgContainer,
					}}
				>

				</Header>
				<Content
					style={{
						margin: '24px 16px',
					}}
				>
					<div
						style={{
							padding: 24,
							minHeight: window.innerHeight - 100,
							background: colorBgContainer,
							borderRadius: borderRadiusLG,
						}}
					>
						<ContentOfPage role={role} />
					</div>
				</Content>
			</Layout>
		</Layout>
	);
};

const ContentOfPage = ({ role }) => {
	const adminContent = (
		<Routes>
			<Route index element={<UserManagementContent />} />
			<Route path='/user-management' element={<UserManagementContent />} />
			<Route path='/ticket-management' element={<TicketManagementContent />} />
		</Routes>
	);

	const staffContent = (
		<Routes>
			<Route index element={<EventContent />} />
			<Route path='/event' element={<EventContent />} />
			<Route path='/report-error' element={<ReportErrorContent />} />
			<Route path='/check-ticket' element={<CheckTicket />} />

		</Routes>
	);

	const managerContent = (
		<Routes>
			<Route index element={<EventManagementContent />} />
			<Route index path='/event-management' element={<EventManagementContent />} />
			<Route path='/event-management/:eventId' element={<EventDetail />} />
			<Route path='/device-management' element={<DeviceManagementContent />} />
			{/* <Route path='/manager-dashboard' element={<ManagerDashboardContent />} /> */}
			<Route path='/product-management' element={<ProductManagement />} />
			<Route path='/report' element={<ReportContent />} />
		</Routes>
	);

	switch (role) {
		case 'admin':
			return adminContent;
		case 'staff':
			return staffContent;
		case 'manager':
			return managerContent;
		default:
			return null;
	}
};

export default Sidebar;