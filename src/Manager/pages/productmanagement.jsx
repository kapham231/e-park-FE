import { Tabs } from "antd";
import ProductTypeList from "../components/producttypelist";
import ProductList from "../components/productlist";

const { TabPane } = Tabs;

const ProductManagement = () => {
    return (
        <div>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Product Type List" key="1" destroyInactiveTabPane={true}>
                    <ProductTypeList />
                </TabPane>
                <TabPane tab="Product List" key="2" destroyInactiveTabPane={true}>
                    <ProductList />
                </TabPane>
            </Tabs>

        </div>
    );
}

export default ProductManagement;