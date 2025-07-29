import React from "react";
import { Table, Button, Popconfirm } from "antd";
import ProductModal from "./productModal";

const ProductList = () => {
    const [editingProduct, setEditingProduct] = React.useState(null);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const productListExample = [
        {
            id: 1,
            name: "Burger",
            quantity: 100,
            typeName: "Food",
            salePrice: 15000
        },
        {
            id: 2,
            name: "Coke",
            quantity: 50,
            typeName: "Drink",
            salePrice: 10000
        },
        {
            id: 3,
            name: "Lays",
            quantity: 200,
            typeName: "Snack",
            salePrice: 5000
        }
    ];

    const columns = [
        {
            title: "Product Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Quantity",
            dataIndex: "quantity",
            key: "quantity",
            sorter: (a, b) => a.quantity - b.quantity,
        },
        {
            title: "Type",
            dataIndex: "typeName",
            key: "typeName",
        },
        {
            title: "Sale Price",
            dataIndex: "salePrice",
            key: "salePrice",
            sorter: (a, b) => a.salePrice - b.salePrice,
            render: (text) => `${Number(text).toLocaleString("vi-VN")} VND`
        },
        {
            title: "Action",
            key: "action",
            align: "center",
            render: (_, record) => (
                <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    <Button type="link" onClick={() => handleEditProduct(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure to delete this product?"
                        onConfirm={() => handleDeleteProduct(record.id)}
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
    const [productList, setProductList] = React.useState(productListExample);

    const handleCreateProduct = () => {
        setEditingProduct(null);
        setIsModalVisible(true);
    };

    const handleSubmitProduct = (values) => {
        if (editingProduct) {
            setProductList(productList.map(product => product.id === editingProduct.id ? { ...product, ...values } : product));
        } else {
            setProductList([...productList, { ...values, id: productList.length + 1 }]);
        }
        setIsModalVisible(false);
        setEditingProduct(null);
    };

    const handleEditProduct = (record) => {
        setEditingProduct(record);
        setIsModalVisible(true);
    };
    const handleDeleteProduct = (id) => {
        setProductList(productList.filter(product => product.id !== id));
    };


    return (
        <div>
            <Button
                style={{ backgroundColor: "#3b71ca", color: "white", marginBottom: "16px" }}
                onClick={handleCreateProduct}
            >
                Add New Product
            </Button>

            <Table dataSource={productList} columns={columns} />

            <ProductModal
                visible={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                onSubmit={handleSubmitProduct}
                initialValues={editingProduct}
            />


        </div>
    );
}

export default ProductList;