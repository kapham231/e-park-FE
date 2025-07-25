import CartItem from "../components/CartItem";
import "../css/Cart.css";

const cartList = [
  {
    id: 1,
    name: "Latest N-5 Perfume",
    category: "Perfumes",
    price: 120.0,
    deliveryCharge: 15.0,
    quantity: 1,
    image:
      "https://i.pinimg.com/1200x/1c/16/be/1c16bee7481b00814a3d358b6e110fd8.jpg",
  },
  {
    id: 2,
    name: "Classic Leather Jacket",
    category: "Clothing",
    price: 250.0,
    deliveryCharge: 20.0,
    quantity: 1,
    image:
      "https://i.pinimg.com/1200x/1c/16/be/1c16bee7481b00814a3d358b6e110fd8.jpg",
  },
  {
    id: 3,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 150.0,
    deliveryCharge: 10.0,
    quantity: 1,
    image:
      "https://i.pinimg.com/1200x/1c/16/be/1c16bee7481b00814a3d358b6e110fd8.jpg",
  },
];
const Cart = () => {
  return (
    <section class="cart-section">
      <div class="cart-container">
        <h2 class="cart-title">Shopping Cart</h2>

        <div class="cart-headers">
          <div>Product</div>
          <div className="center">Quantity</div>
          <div className="center">Total</div>
        </div>

        {cartList.map((item) => (
          <CartItem cartItem={item} key={item.id} />
        ))}

        <div class="cart-summary">
          <div class="summary-row">
            <span>Sub Total</span>
            <span>$360.00</span>
          </div>
          <div class="summary-row">
            <span>Delivery Charge</span>
            <span>$45.00</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span class="value">$405.00</span>
          </div>
        </div>

        <div class="cart-buttons">
          <button class="cart-button btn-primary">
            Continue to Payment
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="22"
              viewBox="0 0 23 22"
              fill="none"
            >
              <path
                d="M8.75324 5.49609L14.2535 10.9963L8.75 16.4998"
                stroke="white"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cart;
