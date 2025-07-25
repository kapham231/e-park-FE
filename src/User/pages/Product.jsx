import { useEffect, useState } from "react";
import { getProducts } from "../../ApiService/userApi";
import { message, Select } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import ProductItem from "../components/ProductItem";

import "../css/Product.css";
import SearchBar from "../../components/SearchBar";
import { Link } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, [products]);

  const fetchProducts = async () => {
    try {
      const tempProducts = await getProducts();
      setProducts([
        ...tempProducts,
        ...tempProducts,
        ...tempProducts,
        ...tempProducts,
        ...tempProducts,
        ...tempProducts,
        ...tempProducts,
      ]);
    } catch (error) {
      console.error("Error:", error);
      message.error("Failed to fetch events.");
    }
  };

  return (
    <div className="product-container">
      <div className="product-header">
        <Select
          value={filter}
          onChange={setFilter}
          className="product-type-filter"
          options={[
            { value: "all", label: "All" },
            { value: "food", label: "Food" },
            { value: "drink", label: "Drink" },
            { value: "others", label: "Others" },
          ]}
        />
        <div className="search-bar-container">
          <SearchBar placeholder={"Search products..."} />
        </div>
        <Link to={"/user/cart"} className="cart-icon-container">
          <div className="cart-icon">
            <ShoppingCartOutlined />
            <p>Cart</p>
          </div>
        </Link>
      </div>
      <div className="product-list">
        {products.map((product) => (
          <ProductItem product={product} />
        ))}
      </div>
    </div>
  );
};

export default Product;
