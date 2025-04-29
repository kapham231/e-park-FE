import React, { useEffect, useState } from "react";
import { Button, message, Table, Modal } from "antd";
// import DeviceDetailsModal from "./devicedetailmodal";
import { calculatePriceMaintenanceEquipment, getAllSupplier, getDeviceByStatus, updateDeviceById } from "../../ApiService/playgroundmanagerApi";
import { updateInvoice } from "../../ApiService/userApi";
// import DeviceModal from "./devicemodal";

const DeviceReportsTab = () => {
	const [devices, setDevices] = useState([]);

	useEffect(() => {
		const status = "Error"; // Trạng thái thiết bị cần tìm
		fetchErrorDevices(status);
	}, []);

	const fetchErrorDevices = (status) => {
		getDeviceByStatus(status)
			.then(async (deviceList) => {
				const suppliersList = await getAllSupplier();

				if (deviceList.length === 0) {
					setDevices([])
					return;
				}

				const supplierMap = suppliersList.reduce((map, supplier) => {
					map[supplier._id] = supplier.name;
					return map;
				}, {});

				const devicesWithSupplierName = deviceList.map((device) => ({
					...device,
					supplierName: supplierMap[device.supplierId] || "N/A", // Gán tên nhà cung cấp hoặc "N/A" nếu không tìm thấy
				}));

				setDevices(devicesWithSupplierName)
			})
			.catch((err) => {
				console.error("Error fetching devices:", err);
			})
			.finally(() => {
				console.log("Devices fetched successfully", devices);
			});
	}

	const handleConfirm = async (deviceId) => {
		console.log("Confirm repair for device", deviceId);
		// Thêm logic để xác nhận sửa chữa thiết bị
		await updateDeviceById(deviceId, {
			status: "Available",
		});
		// Cập nhật lại danh sách thiết bị sau khi sửa chữa
		const status = "Error"; // Trạng thái thiết bị cần tìm
		fetchErrorDevices(status);
		const invoice = (await calculatePriceMaintenanceEquipment(deviceId)).invoice;
		console.log(invoice);
		const newInvoice = await updateInvoice(invoice._id, {
			status: "PAID",
		});

		console.log(newInvoice)

		// Hien thông báo thành công
		message.success("Repair confirmed successfully");
	};

	const handleClose = async () => {
		message.error("Repair cancelled");
	}


	const columns = [
		{
			title: "Device Type",
			dataIndex: "typeName",
			key: "typeName",
			ellipsis: true,
			defaultSortOrder: "ascend",
			sorter: (a, b) => a.typeName.localeCompare(b.typeName),
		},
		{
			title: "Code",
			dataIndex: "code",
			key: "code",
			ellipsis: true,
			sorter: (a, b) => a.code.localeCompare(b.code),
		},
		{
			title: "Supplier",
			dataIndex: "supplierName",
			key: "supplier",
			ellipsis: true,
			sorter: (a, b) => a.supplierName.localeCompare(b.supplierName),
		},
		{
			title: "Action",
			key: "action",
			align: 'center',
			render: (_, record) => (
				<Button type="primary" onClick={() => {
					Modal.confirm({
						title: "Confirm",
						content: "Are you sure to confirm error of this device?",
						onOk() { handleConfirm(record._id) },
						onCancel() { handleClose() }
					})
				}}>
					Confirm
				</Button>
			),
		},
	];


	return (
		<div style={{ margin: "20px" }}>
			<Table
				columns={columns}
				dataSource={devices}
				rowKey="id"
				pagination={{
					pageSize: 10,
					showSizeChanger: true,
					pageSizeOptions: [10],
					showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} errors`,
					style: { marginTop: '16px', textAlign: 'right' }
				}}
				scroll={{ x: 'max-content' }}
				style={{ marginTop: '20px' }}
			/>
		</div>
	);
};

export default DeviceReportsTab;