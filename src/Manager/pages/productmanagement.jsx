import { Tabs } from 'antd'
import ProductTypeList from '../components/producttypelist'
import ProductList from '../components/productlist'

const ProductManagement = () => {
  const items = [
    {
      key: '1',
      label: `Product Type List`,
      children: <ProductTypeList />
    },
    {
      key: '2',
      label: `Product List`,
      children: <ProductList />
    }
  ]

  return (
    <div>
      <Tabs defaultActiveKey='1' items={items} destroyOnHidden />
    </div>
  )
}

export default ProductManagement
