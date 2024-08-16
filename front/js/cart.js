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
  
  // Function to validate form fields
  function validateForm() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const address = document.getElementById('address').value.trim();
    const city = document.getElementById('city').value.trim();
    const email = document.getElementById('email').value.trim();
  
    const nameRegex = /^[A-Za-z\s'-]+$/;
    // const addressRegex = /^[A-Za-z0-9\s,'-]+$/;   
    const addressRegex = /^[0-9]+\s+[A-Za-z0-9\s,'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    
    let valid = true;
  
    if (!nameRegex.test(firstName)) {
      document.getElementById('firstNameErrorMsg').textContent = 'Please enter a valid first name.';
      valid = false;
    } else {
      document.getElementById('firstNameErrorMsg').textContent = '';
    }
  
    if (!nameRegex.test(lastName)) {
      document.getElementById('lastNameErrorMsg').textContent = 'Please enter a valid last name.';
      valid = false;
    } else {
      document.getElementById('lastNameErrorMsg').textContent = '';
    }
  
    if (!addressRegex.test(address)) {
      document.getElementById('addressErrorMsg').textContent = 'Please enter a valid address.';
      valid = false;
    } else {
      document.getElementById('addressErrorMsg').textContent = '';
    }
  
    if (!nameRegex.test(city)) {
      document.getElementById('cityErrorMsg').textContent = 'Please enter a valid city.';
      valid = false;
    } else {
      document.getElementById('cityErrorMsg').textContent = '';
    }
  
    if (!emailRegex.test(email)) {
      document.getElementById('emailErrorMsg').textContent = 'Please enter a valid email.';
      valid = false;
    } else {
      document.getElementById('emailErrorMsg').textContent = '';
    }
  
    return valid;
  }
  
  // Function to handle form submission
  function handleFormSubmission(event) {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
  
    const contact = {
      firstName: document.getElementById('firstName').value.trim(),
      lastName: document.getElementById('lastName').value.trim(),
      address: document.getElementById('address').value.trim(),
      city: document.getElementById('city').value.trim(),
      email: document.getElementById('email').value.trim(),
    };
  
    const products = getCart().map(item => item.id);
  
    const order = {
      contact,
      products
    };
  
    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    })
      .then(response => response.json())
      .then(data => {
        window.location.href = `confirmation.html?orderId=${data.orderId}`;
      })
      .catch(error => {
        console.error('Error confirming order:', error);
      });
  }
  
  // Function to attach the form submission handler
  function attachFormHandler() {
    const orderForm = document.querySelector('.cart__order__form');
    orderForm.addEventListener('submit', handleFormSubmission);
  }
  
  // Main function to execute on page load
  function main() {
    displayCartItems();
    attachFormHandler();
  }
  
  // Execute the main function
  
  document.addEventListener('DOMContentLoaded', main);
  