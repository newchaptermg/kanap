// Function to display the order ID
function displayOrderId() {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');
    if (orderId) {
      document.getElementById('orderId').textContent = orderId;
      clearCart(); // Clear the cart after displaying the order ID
    } else {
      console.log('Order ID not found.');
    }
  }
  
  // Function to clear the cart
  function clearCart() {
    localStorage.removeItem('cart');
  }
  
  // Run display function when the document is loaded
  document.addEventListener('DOMContentLoaded', displayOrderId);
  