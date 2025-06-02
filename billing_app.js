document.addEventListener('DOMContentLoaded', () => {
    const fullCartItemsContainer = document.getElementById('full-cart-items-container');
    const subtotalElement = document.getElementById('subtotal'); // New
    const discountAppliedInfoElement = document.getElementById('discount-applied-info'); // New
    const discountAmountDisplayElement = document.getElementById('discount-amount-display'); // New
    const discountValueElement = document.getElementById('discount-value'); // New
    const grandTotalElement = document.getElementById('grand-total');
    const backToMenuButton = document.getElementById('back-to-menu');
    const confirmOrderButton = document.getElementById('confirm-order');
    const discountPercentageInput = document.getElementById('discount-percentage'); // New
    const applyDiscountButton = document.getElementById('apply-discount-btn'); // New

    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];
    let currentAppliedDiscountPercentage = 0; // To store the applied discount

    function renderBillingCart() {
        if (!fullCartItemsContainer) return;

        if (cart.length === 0) {
            fullCartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty. <a href="index.html">Go back to menu</a> to add items.</p>';
            if(subtotalElement) subtotalElement.textContent = '0.00';
            if(grandTotalElement) grandTotalElement.textContent = '0.00';
            if(discountAppliedInfoElement) discountAppliedInfoElement.style.display = 'none';
            if(discountAmountDisplayElement) discountAmountDisplayElement.style.display = 'none';
            // Disable discount input if cart is empty
            if(discountPercentageInput) discountPercentageInput.disabled = true;
            if(applyDiscountButton) applyDiscountButton.disabled = true;
            return;
        }

        // Enable discount input if cart has items
        if(discountPercentageInput) discountPercentageInput.disabled = false;
        if(applyDiscountButton) applyDiscountButton.disabled = false;

        fullCartItemsContainer.innerHTML = ''; 
        let currentSubtotal = 0;

        const table = document.createElement('table');
        table.className = 'billing-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Amount</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
        const tbody = table.querySelector('tbody');

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            currentSubtotal += itemTotal;

            const row = tbody.insertRow();
            row.innerHTML = `
                <td data-label="Item">${item.name}</td>
                <td data-label="Price">$${item.price.toFixed(2)}</td>
                <td data-label="Qty">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                </td>
                <td data-label="Amount">$${itemTotal.toFixed(2)}</td>
                <td data-label="Action"><button class="remove-item-btn" data-id="${item.id}">Remove</button></td>
            `;
        });

        fullCartItemsContainer.appendChild(table);

        // Calculate discount
        const discountAmount = (currentSubtotal * currentAppliedDiscountPercentage) / 100;
        const finalGrandTotal = currentSubtotal - discountAmount;

        if (subtotalElement) {
            subtotalElement.textContent = currentSubtotal.toFixed(2);
        }

        if (currentAppliedDiscountPercentage > 0 && discountAmount > 0) {
            if (discountValueElement) discountValueElement.textContent = discountAmount.toFixed(2);
            if (discountAmountDisplayElement) discountAmountDisplayElement.style.display = 'block';
            if (discountAppliedInfoElement) {
                discountAppliedInfoElement.textContent = `${currentAppliedDiscountPercentage}% discount applied.`;
                discountAppliedInfoElement.style.display = 'block';
            }
        } else {
            if (discountAmountDisplayElement) discountAmountDisplayElement.style.display = 'none';
            if (discountAppliedInfoElement) discountAppliedInfoElement.style.display = 'none';
        }
        
        if (grandTotalElement) {
            grandTotalElement.textContent = finalGrandTotal.toFixed(2);
        }

        // Add event listeners for quantity changes and item removal
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', updateQuantity);
        });
        document.querySelectorAll('.remove-item-btn').forEach(button => {
            button.addEventListener('click', removeItemFromCart);
        });
    }

    function handleApplyDiscount() {
        const percentageText = discountPercentageInput.value;
        let percentage = parseFloat(percentageText);

        if (isNaN(percentage) || percentage < 0) {
            percentage = 0; // Default to 0 if invalid or negative
            alert("Please enter a valid positive discount percentage.");
        } else if (percentage > 100) {
            percentage = 100; // Cap at 100%
            alert("Discount cannot exceed 100%.");
        }
        
        currentAppliedDiscountPercentage = percentage;
        discountPercentageInput.value = percentage; // Update input field with validated/capped value

        renderBillingCart(); // Re-render to apply discount and update totals
    }

    if (applyDiscountButton) {
        applyDiscountButton.addEventListener('click', handleApplyDiscount);
    }

    function updateQuantity(event) {
        const itemId = parseInt(event.target.dataset.id);
        const action = event.target.dataset.action;
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (itemIndex > -1) {
            if (action === 'increase') {
                cart[itemIndex].quantity += 1;
            } else if (action === 'decrease') {
                cart[itemIndex].quantity -= 1;
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1); 
                }
            }
            saveCartAndRerender();
        }
    }

    function removeItemFromCart(event) {
        const itemId = parseInt(event.target.dataset.id);
        cart = cart.filter(item => item.id !== itemId);
        saveCartAndRerender();
    }

    function saveCartAndRerender() {
        localStorage.setItem('restaurantCart', JSON.stringify(cart));
        renderBillingCart(); 
    }
    
    if (backToMenuButton) {
        backToMenuButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    if (confirmOrderButton) {
        confirmOrderButton.addEventListener('click', () => {
            if (cart.length > 0) {
                const finalTotal = parseFloat(grandTotalElement.textContent).toFixed(2);
                alert(`Order Confirmed (Simulated)!\nSubtotal: $${subtotalElement.textContent}\nDiscount Applied: ${currentAppliedDiscountPercentage}%\nFinal Total: $${finalTotal}\n\nThank you for your purchase. We will clear your cart now.`);
                cart = []; 
                currentAppliedDiscountPercentage = 0; // Reset discount
                if(discountPercentageInput) discountPercentageInput.value = ''; // Clear discount input
                localStorage.removeItem('restaurantCart');
                renderBillingCart(); 
            } else {
                alert("Your cart is empty. Please add items before confirming.");
            }
        });
    }

    // Initial render
    renderBillingCart();
});