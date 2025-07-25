import "../css/ProductItem.css";
const ProductItem = ({ product }) => {
  return (
    <div className="product-item-container">
      <img
        src="https://i.pinimg.com/1200x/1c/16/be/1c16bee7481b00814a3d358b6e110fd8.jpg"
        alt="Product"
        className="product-item-image"
      />
      <p className="product-item-type">{product.typeName}</p>
      <p className="product-item-name">{product.name}</p>
      <p className="product-item-price">{product.purchasePrice}</p>
      <button type="button" className="add-to-cart-button">
        Add to cart
      </button>
    </div>
  );
};

export default ProductItem;
