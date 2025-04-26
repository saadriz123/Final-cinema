// checkout.js (Short code with short comments, original dropdown functions)

document.addEventListener("DOMContentLoaded", () => {
  // Get needed elements from the page
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const sumBody = document.getElementById("checkout-summary");
  const totalEl = document.getElementById("checkout-total");
  const seatOpts = document.getElementById("seat-options"); // Dropdown list
  const seatsIn = document.getElementById("selected-seats"); // Text display
  const form = document.getElementById("payment-form");
  const main = document.querySelector('main');
  const seatBtn = document.getElementById('toggle-btn');     // Dropdown button
  const seatDrop = document.getElementById('dropdown-container'); // Dropdown div
  const seatArea = document.getElementById('seat-selection-area') || (seatBtn ? seatBtn.closest('section') : null);

  // If cart is empty, show message and hide form/seats
  if (!cart.length) {
      if(sumBody) sumBody.innerHTML = `<tr><td colspan="4">Cart empty. <a href="booking.html">Add tickets</a>.</td></tr>`;
      if(form) form.style.display = 'none';
      if(seatArea) seatArea.style.display = 'none';
      return; // Stop here
  }

  let totalCost = 0, seatsNeeded = 0;

  // Fill order summary table and calculate totals
  if (sumBody && totalEl) {
      sumBody.innerHTML = ""; // Clear first
      cart.forEach(item => {
          const price = +item.price || 0, seats = +item.seats || 0, itemTotal = price * seats;
          totalCost += itemTotal; seatsNeeded += seats;
          sumBody.innerHTML += `<tr><td>${item.movie}</td><td>${seats}</td><td>$${price.toFixed(2)}</td><td>$${itemTotal.toFixed(2)}</td></tr>`;
      });
      totalEl.textContent = `$${totalCost.toFixed(2)}`; // Show total cost
  }

  // Setup the seat selection dropdown (original logic)
  if (seatOpts && seatsIn) {
      seatOpts.innerHTML = ""; // Clear old options
      ['A', 'B', 'C', 'D', 'E', 'F'].forEach(r => { for (let i = 1; i <= 10; i++) seatOpts.add(new Option(`${r}${i}`, `${r}${i}`)) }); // Add A1-F10
      seatOpts.size = Math.min(seatsNeeded > 0 ? seatsNeeded + 2 : 10, 10); // Set dropdown size
      seatsIn.placeholder = `Select ${seatsNeeded} seat(s)`; // Update placeholder text
      seatOpts.addEventListener('change', updateSeatsDisplay); // Update display on change
  }

  // Make dropdown toggle button work (original logic)
  if (seatBtn && seatDrop) {
      seatBtn.addEventListener('click', () => { seatDrop.style.display = seatDrop.style.display === "block" ? "none" : "block"; });
      // Hide dropdown if clicked outside
      document.addEventListener("click", (e) => { if (!seatDrop.contains(e.target) && e.target !== seatBtn) seatDrop.style.display = "none"; });
  }

  // Handle the payment form submission
  if (form) form.addEventListener("submit", submitHandler);

  // ----- Helper Functions -----

  // Update the text input showing selected dropdown seats
  function updateSeatsDisplay() { if(seatOpts && seatsIn) seatsIn.value = Array.from(seatOpts.selectedOptions).map(o => o.value).join(", "); }

  // Runs when the payment form is submitted
  function submitHandler(e) {
      e.preventDefault(); // Stop page reload
      // If form and seat selection are valid...
      if (isValidForm() && isValidSeats(seatsNeeded)) {
          showConfirm(); // Show thank you message
      }
  }

  // Shows the final confirmation/thank you message
  function showConfirm() {
      const ref = Math.random().toString(36).substring(2, 10).toUpperCase(); // Random ref#
      const seats = seatsIn ? seatsIn.value : 'N/A';
      const movies = cart.map(i => `${i.movie} (${i.seats})`).join(', '); // List movies
      // Simple HTML for confirmation
      const msg = `<section><h2>Thank You!</h2><p>Details:</p><ul><li>Movies: ${movies}</li><li>Seats: ${seats||'N/A'}</li><li>Ref: ${ref}</li><li>Total: $${totalCost.toFixed(2)}</li></ul><p>Check email.</p><p><a href="booking.html">Book More</a></p></section>`;
      if (main) main.innerHTML = msg; // Replace main content
      localStorage.removeItem("cart"); // Clear cart
  }

  // Checks if the payment form fields are valid
  function isValidForm() {
      // Check required fields have value
      for (const el of form.querySelectorAll("[required]")) { if (!el.value.trim()) { alert(`Missing: ${el.name||el.type}`); el.focus(); return false; }}
      // Check specific fields
      const card = form.querySelector('[name="cardnumber"]'), expiry = form.querySelector('[name="expiry"]'), cvv = form.querySelector('[name="cvv"]');
      if (!/^\d{16}$/.test(card.value.replace(/\s+/g, ''))) { alert("enter 16 digit card number"); card.focus(); return false; } // 16 digits?
      const [y, m] = expiry.value.split('-'); if (new Date(+y, +m, 0) < new Date()) { alert("Expired"); expiry.focus(); return false; } // Not expired?
      if (!/^\d{3}$/.test(cvv.value.trim())) { alert("enter 3 digit CVV"); cvv.focus(); return false; } // 3 digits?
      return true; // All good
  }

  // Checks if the correct number of seats were selected (dropdown logic)
  function isValidSeats(needed) {
      if (!seatsIn || !seatOpts) return true; // Skip if no dropdown
      const count = seatOpts.selectedOptions.length;
      if (count !== needed) { alert(`Need ${needed} seats, got ${count}.`); if(seatDrop) seatDrop.style.display='block'; return false; } // Check count
      return true; // Count matches
  }
});

// --- Global Functions (Keep if HTML uses onclick/onchange) ---
function toggleDropdown() { const d=document.getElementById("dropdown-container"); if(d) d.style.display=d.style.display==="block"?"none":"block"; }
function handleSeatSelection() { const o=document.getElementById("seat-options"), i=document.getElementById("selected-seats"); if(o&&i) i.value=Array.from(o.selectedOptions).map(opt=>opt.value).join(", ");}