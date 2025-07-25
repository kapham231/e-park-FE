import "../css/CartItem.css";
const CartItem = ({ cartItem }) => {
  return (
    <div class="cart-item">
      <div class="cart-item-left">
        <img
          src="https://i.pinimg.com/1200x/1c/16/be/1c16bee7481b00814a3d358b6e110fd8.jpg"
          alt="item"
          class="cart-img"
        />
        <div class="product-info">
          <h5 class="product-name">Latest N-5 Perfuam</h5>
          <p class="product-category">Perfumes</p>
          <h6 class="product-price">$120.00</h6>
        </div>
      </div>

      <div className="cart-item-quantity">
        <div class="quantity-control">
          <button class="qty-btn">-</button>
          <input type="text" class="qty-input" placeholder="1" />
          <button class="qty-btn">+</button>
        </div>
      </div>

      <div class="total-price">$120.00</div>
    </div>
  );
};

export default CartItem;
