import { Button, Table, Space, message, Popconfirm, Select, Tag } from "antd";
import { useEffect, useState } from "react";
import AddUserModal from "./addusermodal";
import ForgotPasswordModal from "./forgotpasswordmodal";

import '../css/usermanagement.css';
import { deleteUserbyId, getAllUserWithRole } from "../../ApiService/adminApi";

const { Option } = Select;
const UserManagementContent = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
    const [roleFilter, setRoleFilter] = useState('All');
    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);
    const fetchUsers = async () => {
        try {
            const response = await getAllUserWithRole();
            let filteredUsers = response.data.filter(user => user.__t); // Lọc các bản ghi không có giá trị __t
            if (roleFilter !== 'All') {
                filteredUsers = filteredUsers.filter(user => user.__t === roleFilter);
            }
            setUsers(filteredUsers);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleRoleFilterChange = (value) => {
        setRoleFilter(value);
    };


    const columns = [
        {
            title: 'Name',
            dataIndex: 'username',
            key: 'name',
            fixed: 'left',
            render: (_, record) => `${record.firstName} ${record.lastName}`,
            defaultSortOrder: 'ascend',
            sorter: (a, b) => {
                const nameA = `${a.firstName} ${a.lastName}`;
                const nameB = `${b.firstName} ${b.lastName}`;
                return nameA.localeCompare(nameB);
            }
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: 'Role',
            dataIndex: '__t',
            key: 'role',
            render: (roleTag) => {
                let color;
                switch (roleTag) {
                    case 'PlaygroundManager':
                        color = 'red';
                        break;
                    case 'Staff':
                        color = 'blue';
                        break;
                    case 'Customer':
                        color = 'green';
                        break;
                    default:
                        color = 'gray';
                }
                return <Tag color={color}>{roleTag}</Tag>;

            },
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button className="edit-button" onClick={() => showEditUserModal(record)}>Edit</Button>
                    <Button className="recoverpassword-button" onClick={() => handleRecoverPassword(record)}>Recover Password</Button>
                    <Popconfirm
                        title="Delete the user"
                        description="Are you sure to delete this user?"
                        onConfirm={() => handleDeleteUser(record._id, true)}
                        onCancel={() => handleDeleteUser(record._id, false)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button className="delete-button">Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const showAddUserModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    };

    const showEditUserModal = (user) => {
        setEditingUser(user); // Lưu user cần chỉnh sửa
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleAddUser = async (newUser) => {
        try {
            // console.log(newUser);
            setUsers((prevUsers) => [...prevUsers, newUser]);
            await fetchUsers();
            message.success("User added successfully!");
            handleModalClose(); // Đóng modal sau khi thêm user
        } catch (error) {
            console.log(error);
        }
    };

    const handleEditUser = async (updatedUser) => {
        try {
            if (updatedUser) {
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user._id === updatedUser._id ? { ...user, ...updatedUser } : user
                    )
                );
                await fetchUsers();
                message.success("User updated successfully!");
            }
            handleModalClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleRecoverPassword = (user) => {
        setSelectedUser(user); // Lưu thông tin người dùng được chọn
        setIsForgotPasswordModalOpen(true); // Mở modal
    };

    const handleForgotPasswordModalClose = () => {
        setIsForgotPasswordModalOpen(false); // Đóng modal
        setSelectedUser(null); // Xóa thông tin người dùng được chọn
    };


    const handleDeleteUser = async (id, confirm) => {
        try {
            if (confirm) {
                await deleteUserbyId(id);
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
                await fetchUsers();
                message.success("User has been deleted successfully!");
            } else {
                message.error('Cancel delete user!!!');
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div>
                <Button className="AD-add-user-button" onClick={showAddUserModal}>Add User</Button>
                <Select
                    defaultValue="All"
                    style={{ width: 200, marginLeft: 20 }}
                    onChange={handleRoleFilterChange}
                >
                    <Option value="All">All</Option>
                    <Option value="PlaygroundManager">Manager</Option>
                    <Option value="Staff">Staff</Option>
                    <Option value="Customer">Customer</Option>
                </Select>
            </div>

            <div
                style={{
                    marginTop: '20px',
                    overflowX: "auto"
                }}
            >
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="username"
                    scroll={{
                        x: 'max-content',
                    }}
                />
            </div>

            {/* AddUserModal Component */}
            <AddUserModal
                isModalOpen={isModalOpen}
                onClose={handleModalClose}
                onAddUser={handleAddUser}
                onEditUser={handleEditUser}
                editingUser={editingUser}
            />

            <ForgotPasswordModal
                visible={isForgotPasswordModalOpen}
                onClose={handleForgotPasswordModalClose}
                initialValues={selectedUser}
            />
        </>
    );
};


export default UserManagementContent;
