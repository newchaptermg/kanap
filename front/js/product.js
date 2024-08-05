// Function to get product ID from URL
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Fetch and display the product details
function displayProductDetails(productId) {
  fetch(`http://localhost:3000/api/products/${productId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(product => {
      document.getElementById('title').textContent = product.name;
      document.getElementById('price').textContent = product.price;
      document.getElementById('description').textContent = product.description;

      const productImage = document.createElement('img');
      productImage.src = product.imageUrl;
      productImage.alt = product.altTxt;
      document.querySelector('.item__img').appendChild(productImage);

      product.colors.forEach(color => {
        const colorOption = document.createElement('option');
        colorOption.value = color;
        colorOption.textContent = color;
        document.getElementById('colors').appendChild(colorOption);
      });
    })
    .catch(error => {
      console.error('Error fetching product details:', error);
    });
}

// Function to add product to the cart
function addToCart(productId) {
  const colorSelect = document.getElementById('colors');
  const quantityInput = document.getElementById('quantity');

  const selectedColor = colorSelect.value;
  const selectedQuantity = parseInt(quantityInput.value, 10);

  if (!selectedColor || selectedQuantity <= 0 || selectedQuantity > 100) {
    alert('Please select a valid color and quantity.');
    return;
  }

  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existingProductIndex = cart.findIndex(item => item.id === productId && item.color === selectedColor);

  if (existingProductIndex >= 0) {
    cart[existingProductIndex].quantity += selectedQuantity;
  } else {
    cart.push({ id: productId, color: selectedColor, quantity: selectedQuantity });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  alert('Product added to the cart');
}

// Main function to execute on page load
function main() {
  const productId = getProductIdFromUrl();
  if (productId) {
    displayProductDetails(productId);

    const addToCartButton = document.getElementById('addToCart');
    addToCartButton.addEventListener('click', () => addToCart(productId));
  } else {
    console.error('Product ID not found in URL');
  }
}

// Execute the main function on page load
document.addEventListener('DOMContentLoaded', main);
