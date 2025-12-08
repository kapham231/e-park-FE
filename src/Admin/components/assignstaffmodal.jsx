import React, { useState } from "react";
import { Modal, Button, List, Tag } from "antd";
// import axios from "axios";

const AssignStaffModal = ({ open, onClose, onAssign, eventId }) => {
    // const [loading, setLoading] = useState(false);
    const [staffList, setStaffList] = useState([
        { id: 1, name: "John Doe", status: "Available" },
        { id: 2, name: "Jane Smith", status: "Busy" },
        { id: 3, name: "Mike Johnson", status: "Available" },
        { id: 4, name: "Emily Davis", status: "Busy" },
    ]);
    // const [loaded, setLoaded] = useState(false);

    // const fetchStaffList = async () => {
    //     setLoading(true);
    //     try {
    //         const response = await axios.get(`/api/staff?eventId=${eventId}`);
    //         setStaffList(response.data);
    //         setLoaded(true);
    //     } catch (error) {
    //         message.error("Failed to fetch staff list");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // React.useEffect(() => {
    //     if (open) {
    //         fetchStaffList();
    //     }
    // }, [open]);

    return (
        <Modal title="Assign Staff" open={open} onCancel={onClose} footer={null}>
            {/* {loading ? (
                <Spin size="large" />
            ) : ( */}
            <List
                dataSource={staffList}
                renderItem={(staff) => (
                    <List.Item
                        actions={[
                            <Button
                                type="primary"
                                disabled={staff.status !== "Available"}
                                onClick={() => onAssign(staff)}
                            >
                                Assign
                            </Button>
                        ]}
                    >
                        <List.Item.Meta title={staff.name} />
                        <Tag color={staff.status === "Available" ? "green" : "red"}>{staff.status}</Tag>
                    </List.Item>
                )}
            />
            {/* )} */}
        </Modal>
    );
};

export default AssignStaffModal;
