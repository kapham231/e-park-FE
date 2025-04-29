import React, { useState } from "react";
import { Button, Card, Col, Form, Image, Input, Row } from "antd"
import { max } from "moment";
import '../css/userprofile.css';

const UserProfileContent = () => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);
    const [backupValues, setBackupValues] = useState({});

    const initialValues = {
        childName: "Nguyễn Văn A",
        role: "Silver",
        bio: "Interesting Boiz",
        childBirthYear: "2015",
        guardianName: "Trần Thị B",
        guardianRelation: "Mẹ",
        guardianPhone: "0123456789",
        guardianAddress: "Hà Nội, Việt Nam",
    };

    const handleEdit = () => {
        setBackupValues(form.getFieldsValue()); // Lưu trạng thái hiện tại trước khi chỉnh sửa
        setIsEditing(true);
    };

    const handleSave = () => {
        form.validateFields().then(values => {
            console.log("Lưu thông tin:", values);
            setIsEditing(false);
        });
    };

    const handleCancel = () => {
        form.setFieldsValue(backupValues); // Khôi phục giá trị cũ
        setIsEditing(false);
    };

    return (
        <>
            <Row gutter={16} style={{ maxWidth: "100%", margin: "auto", display: "flex", flexWrap: "wrap" }}>
                <Col xs={24} sm={10} span={10}>
                    <div className="us-avt-container">
                        <Image
                            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                            width={200}
                            height={200}
                            style={{ borderRadius: "50%" }}
                        />
                        <h3 className="us-child-name">{initialValues.childName}</h3>
                        <p className="us-child-role">{initialValues.role}</p>
                        <p className="us-child-bio">{initialValues.bio}</p>
                    </div>


                </Col>
                <Col xs={24} sm={14} span={14}>
                    <Form form={form} initialValues={initialValues} layout="vertical">
                        {/* Thông tin Trẻ Em */}
                        <Card title="Thông tin Trẻ Em" bordered={false}>
                            <Form.Item name="childName" label="Tên">
                                <Input disabled={!isEditing} />
                            </Form.Item>
                            <Form.Item name="childBirthYear" label="Năm sinh">
                                <Input disabled={!isEditing} />
                            </Form.Item>
                        </Card>

                        {/* Thông tin Người Giám Hộ */}
                        <Card title="Thông tin Người Giám Hộ" bordered={false} style={{ marginTop: 16 }}>
                            <Form.Item name="guardianName" label="Name">
                                <Input disabled={!isEditing} />
                            </Form.Item>
                            <Form.Item name="guardianRelation" label="Relation">
                                <Input disabled={!isEditing} />
                            </Form.Item>
                            <Form.Item name="guardianPhone" label="PhoneNum">
                                <Input disabled={!isEditing} />
                            </Form.Item>
                            <Form.Item name="guardianAddress" label="Address">
                                <Input disabled={!isEditing} />
                            </Form.Item>
                        </Card>

                        {/* Nút Chỉnh sửa và Lưu */}
                        <div className="us-edit-btn-container">
                            {isEditing ? (
                                <>
                                    <Button
                                        onClick={handleSave}
                                        className="us-edit-btn"
                                        style={{ backgroundColor: "#3B71CA", color: "white", marginRight: 8 }}
                                    >
                                        Lưu
                                    </Button>
                                    <Button
                                        onClick={handleCancel}
                                        className="us-cancel-btn"
                                        style={{ backgroundColor: "#FF7676", color: "white" }}
                                    >
                                        Hủy
                                    </Button>
                                </>
                            ) : (
                                <Button onClick={handleEdit} className="us-edit-btn" style={{ backgroundColor: "#3B71CA", color: "white" }}>
                                    Chỉnh sửa
                                </Button>
                            )}
                        </div>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

export default UserProfileContent