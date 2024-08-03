// TODO Get the data from the backend.
// Update sample code below for fetching products from the backend.
// fetch('https://ubahthebuilder.tech/posts/1')
//     .then(data => {
//         return data.json();
//     })
//     .then(post => {
//         console.log(post.title);
//     });
// TODO Display the product image on the main page.
// Fetch products from the API and display them on the homepage
fetch('http://localhost:3000/api/products')
  .then(response => response.json())
  .then(products => {
    const itemsContainer = document.getElementById('items');

    products.forEach(product => {
      // Create a link element for the product
      const productLink = document.createElement('a');
      productLink.href = `product.html?id=${product._id}`;

      // Create an article element to hold the product details
      const productArticle = document.createElement('article');

      // Create and append the product image
      const productImage = document.createElement('img');
      productImage.src = product.imageUrl;
      productImage.alt = product.altTxt;
      productArticle.appendChild(productImage);

      // Create and append the product name
      const productName = document.createElement('h3');
      productName.className = 'productName';
      productName.textContent = product.name;
      productArticle.appendChild(productName);

      // Create and append the product description
      const productDescription = document.createElement('p');
      productDescription.className = 'productDescription';
      productDescription.textContent = product.description;
      productArticle.appendChild(productDescription);

      // Append the article to the link, and the link to the items container
      productLink.appendChild(productArticle);
      itemsContainer.appendChild(productLink);
    });
  })
  .catch(error => console.error('Error fetching products:', error));

