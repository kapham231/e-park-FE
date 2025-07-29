import React from 'react';
import { Button, Table, Popconfirm } from 'antd';
import ProductTypeModal from './productTypeModal';

const ProductTypeList = () => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [editingType, setEditingType] = React.useState(null);

    const productTypeExample = [
        {
            id: 1,
            name: "Food",
            quantity: 100,
        },
        {
            id: 2,
            name: "Drink",
            quantity: 50,
        },
        {
            id: 3,
            name: "Snack",
            quantity: 200,
        }
    ];

    const [productTypes, setProductTypes] = React.useState(productTypeExample);

    const columns = [
        {
            title: "Product Type Name",
            dataIndex: "name",
            key: "type",
            defaultSortOrder: "ascend",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <Button type="link" onClick={() => handleEditType(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this device?"
                        onConfirm={() => handleDeleteType(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    // const [loading, setLoading] = React.useState(true);


    // if (loading) {
    //     return <Spin />;
    // }

    const handleCreateType = () => {
        // Logic to handle creating a new product type
        setEditingType(null);
        setIsModalVisible(true);
    }

    const handleSubmitType = (values) => {
        if (editingType) {
            // Logic to update the existing product type
            setProductTypes(productTypes.map(type => type.id === editingType.id ? { ...type, ...values } : type));
        } else {
            // Logic to add a new product type
            const newType = { id: Date.now(), ...values }; // Using Date.now() as a simple unique ID
            setProductTypes([...productTypes, newType]);
        }
        setIsModalVisible(false);
        setEditingType(null);
    }

    const handleEditType = (record) => {
        setEditingType(record);
        setIsModalVisible(true);
    }

    const handleDeleteType = (id) => {
        setProductTypes(productTypes.filter(type => type.id !== id));
    }

    return (
        <div>
            <Button
                style={{ backgroundColor: "#3b71ca", color: "white", marginBottom: "16px" }}
                onClick={handleCreateType}
            >
                Add Type
            </Button>

            <Table columns={columns} dataSource={productTypes} rowKey="id" />

            <ProductTypeModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleSubmitType}
                initialValues={editingType}
            />
        </div>
    );
}


export default ProductTypeList;