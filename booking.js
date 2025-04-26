document.addEventListener("DOMContentLoaded", () => {
    // Clear the cart from localStorage on page load (as per our earlier discussion)
    // If you want the cart to persist across page loads, remove or comment out the next line.
    // localStorage.removeItem("cart"); // Removed this based on common use case, uncomment if needed
  
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const ticketTableBody = document.getElementById("ticket-table-body");
    const grandTotal = document.getElementById("grand-total");
    const saveFavButton = document.getElementById("save-fav");
    const applyFavButton = document.getElementById("apply-fav");
    const clearCartButton = document.getElementById("clear-cart");
  
    // Load cart from localStorage if it exists, otherwise initialize an empty cart
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    function updateTicketSummary() {
      ticketTableBody.innerHTML = ""; // Clear existing rows
      let total = 0;
  
      cart.forEach(item => {
        const row = document.createElement("tr");
        // Ensure values are treated as numbers for calculation, default to 0 if NaN
        const price = parseFloat(item.price) || 0;
        const seats = parseInt(item.seats) || 0;
        const itemTotal = price * seats;
  
        row.innerHTML = `
          <td>${item.movie}</td>
          <td>${seats}</td>
          <td>$${price.toFixed(2)}</td>
          <td>$${itemTotal.toFixed(2)}</td>
        `;
        ticketTableBody.appendChild(row);
        total += itemTotal; // Add item total to grand total
      });
  
      grandTotal.textContent = `$${total.toFixed(2)}`; // Update grand total display
    }
  
    function handleAddToCart(event) {
      const movieDiv = event.target.closest(".movie"); // Find the parent .movie container
      const movieTitle = movieDiv.querySelector("h3").textContent;
      const seatsInput = movieDiv.querySelector("input[type='number']");
      const price = parseFloat(seatsInput.getAttribute("data-price"));
      const seats = parseInt(seatsInput.value);
  
      if (seats > 0) {
        const existingItemIndex = cart.findIndex(item => item.movie === movieTitle);
  
        if (existingItemIndex > -1) {
          // Update existing item
          cart[existingItemIndex].seats += seats;
          // Recalculate total for the item (not strictly needed if storing per item total, but good practice)
          cart[existingItemIndex].total = cart[existingItemIndex].seats * price;
        } else {
          // Add new item
          const total = price * seats;
          cart.push({ movie: movieTitle, seats, price, total });
        }
  
        // Reset input field after adding to cart
        seatsInput.value = "0";
  
        localStorage.setItem("cart", JSON.stringify(cart)); // Save updated cart to localStorage
        updateTicketSummary(); // Update the summary table
        alert(`${seats} ticket(s) for ${movieTitle} added to cart.`); // Confirmation
      } else {
          alert("Please enter a valid number of seats (at least 1).");
      }
    }
  
    // Add event listeners to all "Add to Cart" buttons
    addToCartButtons.forEach(button => {
      button.addEventListener("click", handleAddToCart);
    });
  
    // Save current cart as favorite
    saveFavButton.addEventListener("click", () => {
      if (cart.length > 0) {
          localStorage.setItem("favoriteCart", JSON.stringify(cart));
          alert("Cart saved as favorite!");
      } else {
          alert("Your cart is empty. Add items before saving as favorite.");
      }
    });
  
    // Apply favorite cart
    applyFavButton.addEventListener("click", () => {
      const savedFav = localStorage.getItem("favoriteCart");
      if (savedFav) {
        cart = JSON.parse(savedFav); // Load favorite cart
        localStorage.setItem("cart", JSON.stringify(cart)); // Update current cart
        updateTicketSummary(); // Update display
        alert("Favorite cart applied!");
      } else {
        alert("No favorite cart saved!");
      }
    });
  
    // Clear current cart
    clearCartButton.addEventListener("click", () => {
      if (cart.length > 0) {
          cart = []; // Empty the cart array
          localStorage.setItem("cart", JSON.stringify(cart)); // Update localStorage
          updateTicketSummary(); // Update display
          alert("Cart cleared!");
      } else {
          alert("Your cart is already empty.");
      }
    });
  
    // Initial display update when the page loads
    updateTicketSummary();
  });