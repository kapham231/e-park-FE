import React from "react";
import { Button, Modal } from "antd";
import useCheckMobile from "../../hooks/useCheckMobile";

const DeviceDetailsModal = ({ visible, device, onClose, onConfirm }) => {
    const isMobile = useCheckMobile()
    if (!device) return null;

    return (
        <Modal
            title={device.name}
            open={visible}
            onCancel={onClose}
            style={{
                top: isMobile ? 0 : ""
            }}
            centered={!isMobile}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Cancel
                </Button>,
                <Button key="confirm" type="primary" onClick={() => onConfirm(device._id)}>
                    Confirm Repair
                </Button>
            ]}
        >
            <img src="https://i.pinimg.com/736x/15/ed/b1/15edb1ea39960c1b02dbfac0579d0328.jpg" alt={device.name} style={{ width: "100%", marginBottom: 16 }} />
            <p><strong>Supplier:</strong> {device.supplierName}</p>
        </Modal>
    );
};

export default DeviceDetailsModal;