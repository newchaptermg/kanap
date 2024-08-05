// Function to retrieve the cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
  }
  
  // Function to save the cart to localStorage
  function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
  // Function to fetch product details from the API
  function fetchProductDetails(productId) {
    return fetch(`http://localhost:3000/api/products/${productId}`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching product details:', error);
      });
  }
  
  // Function to update the total quantity and price
  async function updateTotal() {
    const cart = getCart();
    let totalQuantity = 0;
    let totalPrice = 0;
  
    const productPromises = cart.map(async (cartItem) => {
      const product = await fetchProductDetails(cartItem.id);
      totalQuantity += cartItem.quantity;
      totalPrice += cartItem.quantity * product.price;
    });
  
    await Promise.all(productPromises);
  
    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalPrice').textContent = totalPrice.toFixed(2);
  }
  
  // Function to display the cart items
  async function displayCartItems() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart__items');
    cartItemsContainer.innerHTML = '';  // Clear the container first
  
    for (const cartItem of cart) {
      const product = await fetchProductDetails(cartItem.id);
  
      const cartItemElement = document.createElement('article');
      cartItemElement.className = 'cart__item';
      cartItemElement.dataset.id = cartItem.id;
      cartItemElement.dataset.color = cartItem.color;
  
      const cartItemImgDiv = document.createElement('div');
      cartItemImgDiv.className = 'cart__item__img';
      const cartItemImg = document.createElement('img');
      cartItemImg.src = product.imageUrl;
      cartItemImg.alt = product.altTxt;
      cartItemImgDiv.appendChild(cartItemImg);
  
      const cartItemContentDiv = document.createElement('div');
      cartItemContentDiv.className = 'cart__item__content';
  
      const cartItemContentDescriptionDiv = document.createElement('div');
      cartItemContentDescriptionDiv.className = 'cart__item__content__description';
      const cartItemName = document.createElement('h2');
      cartItemName.textContent = product.name;
      const cartItemColor = document.createElement('p');
      cartItemColor.textContent = cartItem.color;
      const cartItemPrice = document.createElement('p');
      cartItemPrice.textContent = `${product.price} €`;
      cartItemContentDescriptionDiv.appendChild(cartItemName);
      cartItemContentDescriptionDiv.appendChild(cartItemColor);
      cartItemContentDescriptionDiv.appendChild(cartItemPrice);
  
      const cartItemContentSettingsDiv = document.createElement('div');
      cartItemContentSettingsDiv.className = 'cart__item__content__settings';
  
      const cartItemContentSettingsQuantityDiv = document.createElement('div');
      cartItemContentSettingsQuantityDiv.className = 'cart__item__content__settings__quantity';
      const cartItemQuantity = document.createElement('p');
      cartItemQuantity.textContent = 'Quantity: ';
      const cartItemQuantityInput = document.createElement('input');
      cartItemQuantityInput.type = 'number';
      cartItemQuantityInput.className = 'itemQuantity';
      cartItemQuantityInput.name = 'itemQuantity';
      cartItemQuantityInput.min = '1';
      cartItemQuantityInput.max = '100';
      cartItemQuantityInput.value = cartItem.quantity;
      cartItemQuantityInput.addEventListener('change', (event) => updateCartItemQuantity(event, cartItem.id, cartItem.color));
      cartItemContentSettingsQuantityDiv.appendChild(cartItemQuantity);
      cartItemContentSettingsQuantityDiv.appendChild(cartItemQuantityInput);
  
      const cartItemContentSettingsDeleteDiv = document.createElement('div');
      cartItemContentSettingsDeleteDiv.className = 'cart__item__content__settings__delete';
      const cartItemDeleteButton = document.createElement('p');
      cartItemDeleteButton.className = 'deleteItem';
      cartItemDeleteButton.textContent = 'Delete';
      cartItemDeleteButton.addEventListener('click', () => deleteCartItem(cartItem.id, cartItem.color));
      cartItemContentSettingsDeleteDiv.appendChild(cartItemDeleteButton);
  
      cartItemContentSettingsDiv.appendChild(cartItemContentSettingsQuantityDiv);
      cartItemContentSettingsDiv.appendChild(cartItemContentSettingsDeleteDiv);
  
      cartItemContentDiv.appendChild(cartItemContentDescriptionDiv);
      cartItemContentDiv.appendChild(cartItemContentSettingsDiv);
  
      cartItemElement.appendChild(cartItemImgDiv);
      cartItemElement.appendChild(cartItemContentDiv);
  
      cartItemsContainer.appendChild(cartItemElement);
    }
  
    // Update the total quantity and price
    updateTotal();
  }
  
  // Function to update cart item quantity
  function updateCartItemQuantity(event, productId, productColor) {
    const newQuantity = parseInt(event.target.value, 10);
    if (newQuantity <= 0 || newQuantity > 100) {
      alert('Please enter a valid quantity (1-100).');
      return;
    }
  
    const cart = getCart();
    const cartItemIndex = cart.findIndex(item => item.id === productId && item.color === productColor);
    if (cartItemIndex >= 0) {
      cart[cartItemIndex].quantity = newQuantity;
      saveCart(cart);
      updateTotal();  // Update the total quantity and price
    }
  }
  
  // Function to delete a cart item
  function deleteCartItem(productId, productColor) {
    let cart = getCart();
    cart = cart.filter(item => !(item.id === productId && item.color === productColor));
    saveCart(cart);
    displayCartItems();  // Refresh the cart items display and update total quantity and price
  }
  
  // Main function to execute on page load
  function main() {
    displayCartItems();
  }
  
  // Execute the main function on page load
  document.addEventListener('DOMContentLoaded', main);
  