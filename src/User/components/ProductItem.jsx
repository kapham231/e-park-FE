import '../css/ProductItem.css'
const ProductItem = ({ product }) => {
  let validImg = 'https://placehold.co/400/fff/0066CC?font=montserrat&text=E-park\tttttttttt\nProduct'
  checkImageURL(product.background).then((isValid) => {
    if (isValid) {
      validImg = product.background
    }
  })
  return (
    <div className='product-item-container'>
      <img src={validImg} alt='Product' className='product-item-image' />
      <p className='product-item-type'>{product.typeName}</p>
      <p className='product-item-name'>{product.name}</p>
      <p className='product-item-price'>{product.purchasePrice}</p>
      {/* <button type="button" className="add-to-cart-button">
        Add to cart
      </button> */}
    </div>
  )
}

function checkImageURL(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true) // Image loaded successfully
    img.onerror = () => resolve(false) // Error loading image
    img.src = url
  })
}

export default ProductItem
