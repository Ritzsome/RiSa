document.addEventListener('DOMContentLoaded', () => {
    const menu = {
        "Rice Bowls": [
            {
                id: 1,
                name: "Chicken Tikka Rice Bowl",
                description: "Grilled chicken tikka served with aromatic basmati rice and mint chutney.",
                price: 250.00,
                image: "https://media.istockphoto.com/id/531689726/photo/cooked-white-basmati-rice-with-carrot-and-capsicum-toppings.jpg?s=1024x1024&w=is&k=20&c=iKGRtxSZNTPCQsOouT0C5gVUZx9fcq2BD1s7MZtkLcM="
            },
            {
                id: 2,
                name: "Paneer Makhani Rice Bowl",
                description: "Creamy paneer makhani served with basmati rice and a side of salad.",
                price: 220.00,
                image: "https://images.unsplash.com/photo-1679279726937-122c49626802?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            },
            {
                id: 3,
                name: "Spicy Schezwan Veg Rice Bowl",
                description: "Assorted vegetables tossed in spicy Schezwan sauce, served with fried rice.",
                price: 200.00,
                image: "https://images.unsplash.com/photo-1682566509568-ded8649b26bb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
        ],
        "Sandwiches": [
            {
                id: 4,
                name: "Classic Veg Club Sandwich",
                description: "Triple-layered sandwich with fresh vegetables, cheese, and a special sauce.",
                price: 180.00,
                image: "https://media.istockphoto.com/id/1084812732/photo/paneer-bhurji-sandwich-is-a-tasty-paneer-based-dish-made-with-cottage-cheese-served-with.jpg?s=1024x1024&w=is&k=20&c=xoItLjJW-OBlJ_o2dU6S9SJZNFNA3Bt0i9vzR6iNcQA="
            },
            {
                id: 5,
                name: "Grilled Chicken Pesto Sandwich",
                description: "Grilled chicken, fresh pesto, sun-dried tomatoes, and mozzarella on ciabatta.",
                price: 230.00,
                image: "https://media.istockphoto.com/id/1362101397/photo/moong-dal-sandwich.jpg?s=1024x1024&w=is&k=20&c=xDr_Um9Vc5NNZEHfI8UCvzVqqqPvPyxUQxPa3RH1ixM="
            },
            {
                id: 6,
                name: "Mumbai Masala Toast Sandwich",
                description: "Spiced potato filling with vegetables, grilled to perfection.",
                price: 150.00,
                image: "https://media.istockphoto.com/id/1056466978/photo/mumbai-grilled-sandwich.jpg?s=1024x1024&w=is&k=20&c=_Z7kewhjMKbksZjD1Fn85ZiqZQ0nTdnBSOCcX5g1iGQ="
            }
        ]
    };

    const menuItemsContainer = document.getElementById('menu-items-container');
    const cartCountElement = document.getElementById('cart-count');
    const proceedToBillButton = document.getElementById('proceed-to-bill');

    let cart = JSON.parse(localStorage.getItem('restaurantCart')) || [];

    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
        // Show/hide proceed to bill button based on cart content
        if (proceedToBillButton) {
            proceedToBillButton.style.display = cart.length > 0 ? 'block' : 'none';
        }
    }

    function saveCart() {
        localStorage.setItem('restaurantCart', JSON.stringify(cart));
        updateCartCount();
    }

    function addToCart(item) {
        const existingItem = cart.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        saveCart();
        // Optional: Add some visual feedback e.g., alert('Added to cart!');
        console.log(item.name + " added to cart");
    }

    function renderMenu() {
        if (!menuItemsContainer) return; // Only run on index.html

        menuItemsContainer.innerHTML = ''; // Clear existing items

        for (const category in menu) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category-section';

            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = category;
            categoryDiv.appendChild(categoryTitle);

            const itemsGrid = document.createElement('div');
            itemsGrid.className = 'items-grid';

            menu[category].forEach(item => {
                const itemCard = document.createElement('div');
                itemCard.className = 'menu-item-card';
                itemCard.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="menu-item-image">
                    <div class="menu-item-details">
                        <h3 class="menu-item-name">${item.name}</h3>
                        <p class="menu-item-description">${item.description}</p>
                        <p class="menu-item-price">$${item.price.toFixed(2)}</p>
                        <button class="add-to-cart-btn" data-id="${item.id}" data-category="${category}">Add to Cart</button>
                    </div>
                `;
                itemsGrid.appendChild(itemCard);
            });
            categoryDiv.appendChild(itemsGrid);
            menuItemsContainer.appendChild(categoryDiv);
        }

        // Add event listeners to new "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.id);
                const itemCategory = e.target.dataset.category;
                const selectedItem = menu[itemCategory].find(i => i.id === itemId);
                if (selectedItem) {
                    addToCart(selectedItem);
                }
            });
        });
    }

    if (proceedToBillButton) {
        proceedToBillButton.addEventListener('click', () => {
            if (cart.length > 0) {
                window.location.href = 'billing.html'; // Navigate to billing page
            } else {
                alert("Your cart is empty!");
            }
        });
    }
    
    // Initial setup for index.html
    if (menuItemsContainer) {
        renderMenu();
    }
    updateCartCount(); // Update cart count on page load
});