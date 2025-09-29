import React from 'react';
import { Button, Table, Popconfirm } from 'antd';
import ProductTypeModal from './productTypeModal';
import { createProductType, deleteProductTypeById, getAllProductType, updateProductTypeById } from '../../ApiService/playgroundmanagerApi';

const ProductTypeList = () => {
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const [editingType, setEditingType] = React.useState(null);

    const [productTypeList, setProductTypeList] = React.useState(null);
    React.useEffect(() => {
        const fetchProductTypes = async () => {
            try {
                const pTypeList = await getAllProductType();
                setProductTypeList(pTypeList);
            } catch (error) {
                console.error('Error fetching product types:', error);
            }
        };
        fetchProductTypes();
    }, []);

    const columns = [
        {
            title: "Product Type Name",
            dataIndex: "typeName",
            key: "type",
            defaultSortOrder: "ascend",
            sorter: (a, b) => a.typeName.localeCompare(b.typeName),
        },
        {
            title: "Type Code",
            dataIndex: "code",
            key: "code",
            sorter: (a, b) => a.code.localeCompare(b.code),
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
                        onConfirm={() => handleDeleteType(record.id)}
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

    const handleSubmitType = async (values) => {
        if (editingType) {
            // Logic to update the existing product type
            const updatedType = await updateProductTypeById(editingType.id, values);
            const updatedList = productTypeList.map(type => type.id === editingType.id ? { ...type, ...updatedType } : type);
            setProductTypeList(updatedList);
        } else {
            // Logic to add a new product type
            const newType = await createProductType(values);
            const newTypeList = [...productTypeList, newType];
            setProductTypeList(newTypeList);
        }
        setIsModalVisible(false);
        setEditingType(null);
    }

    const handleEditType = (record) => {
        setEditingType(record);
        setIsModalVisible(true);
    }

    const handleDeleteType = async (id) => {
        const deleletedType = await deleteProductTypeById(id);
        if (deleletedType) {
            const updatedList = productTypeList.filter(type => type.id !== id);
            setProductTypeList(updatedList);
        }

    }

    return (
        <div>
            <Button
                style={{ backgroundColor: "#3b71ca", color: "white", marginBottom: "16px" }}
                onClick={handleCreateType}
            >
                Add Type
            </Button>

            <Table columns={columns} dataSource={productTypeList} rowKey="id" />

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