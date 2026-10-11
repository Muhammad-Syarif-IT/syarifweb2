// --- DATA ---
const products = [
    {
        id: 1,
        name: "Professional Noise-Cancelling Headphones",
        desc: "Immersive sound, unmatched comfort for work or travel.",
        price: 249.00,
        img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        name: "Minimalist Analog Watch",
        desc: "Timeless design crafted with stainless steel.",
        price: 159.00,
        img: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        name: "Ergonomic Tech Backpack",
        desc: "Smart organization for your laptop and daily essentials.",
        price: 89.00,
        img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 4,
        name: "Performance Smart T-Shirt",
        desc: "Breathable fabric designed for an active lifestyle.",
        price: 65.00,
        img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 5,
        name: "Ultra-Slim 4K Monitor",
        desc: "Stunning visuals for your home office setup.",
        price: 499.00,
        img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 6,
        name: "Leather Minimalist Wallet",
        desc: "Compact and durable, fits perfectly in your pocket.",
        price: 45.00,
        img: "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    }
];

// --- STATE MANAGEMENT ---
let cart = JSON.parse(localStorage.getItem('modernStoreCart')) || [];

// --- DOM ELEMENTS ---
const productList = document.getElementById('product-list');
const cartIcon = document.querySelector('.cart-icon');
const cartOverlay = document.querySelector('.cart-overlay');
const cartClose = document.querySelector('.close-cart');
const cartContent = document.querySelector('.cart-content');
const cartTotal = document.querySelector('.cart-total-price');
const totalItems = document.querySelector('.total-items');
const clearCartBtn = document.querySelector('.clear-cart-btn');
const checkoutBtn = document.querySelector('.checkout-btn');
const paymentOverlay = document.querySelector('.payment-modal-overlay');
const paymentClose = document.querySelector('.close-payment');
const paymentForm = document.getElementById('payment-form');
const payNowBtn = document.querySelector('.pay-now-btn');
const paymentModal = document.querySelector('.payment-modal');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});

// --- FUNCTIONS ---

// 1. Render Products to HTML
function renderProducts() {
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Bag</button>
            </div>
        `;
        productList.appendChild(productCard);
    });
}

// 2. Add Item to Cart
function addToCart(id) {
    // Check if product exists in cart
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const productToAdd = products.find(product => product.id === id);
        cart.push({ ...productToAdd, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    openCart(); // Optional: open cart automatically when item added
}

// 3. Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('modernStoreCart', JSON.stringify(cart));
}

// 4. Update Cart Sidebar UI
function updateCartUI() {
    // Update item count in nav
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    totalItems.innerText = count;

    // Clear current cart content
    cartContent.innerHTML = '';

    // If cart empty
    if (cart.length === 0) {
        cartContent.innerHTML = '<p style="text-align:center; margin-top:20px;">Your bag is empty.</p>';
        cartTotal.innerText = "$0.00";
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = 0.5;
        return;
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = 1;
    }

    // Render items
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p class="item-price">$${item.price.toFixed(2)}</p>
                <div class="controller">
                    <i class="fas fa-minus qty-btn" onclick="changeQty(${item.id}, -1)"></i>
                    <span>${item.quantity}</span>
                    <i class="fas fa-plus qty-btn" onclick="changeQty(${item.id}, 1)"></i>
                </div>
            </div>
            <i class="fas fa-trash remove-item" onclick="removeFromCart(${item.id})"></i>
        `;
        cartContent.appendChild(cartItem);
    });

    // Update total price
    cartTotal.innerText = `$${total.toFixed(2)}`;
}

// 5. Change Quantity (+ or -1)
function changeQty(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// 6. Remove Item completely
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

// 7. Clear Entire Cart
clearCartBtn.addEventListener('click', () => {
    cart = [];
    saveCart();
    updateCartUI();
});

// --- CART UI CONTROLS ---
const openCart = () => document.body.classList.add('show-cart');
const closeCartFunc = () => document.body.classList.remove('show-cart');

cartIcon.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCartFunc);
cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) closeCartFunc();
});

// --- PAYMENT SIMULATION ---

// Open Payment Modal
checkoutBtn.addEventListener('click', () => {
    closeCartFunc();
    paymentOverlay.classList.add('show-payment');
    paymentModal.classList.remove('payment-complete-active');
    paymentModal.classList.add('payment-mode-active');

    // Update pay button text with total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    payNowBtn.innerText = `Pay $${total.toFixed(2)}`;
});

// Close Payment Modal
const closePaymentFunc = () => paymentOverlay.classList.remove('show-payment');
paymentClose.addEventListener('click', closePaymentFunc);
paymentOverlay.addEventListener('click', (e) => {
    if (e.target === paymentOverlay) closePaymentFunc();
});

// Handle Form Submission (Simulated Success)
paymentForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent actual form submission

    // Simulate processing time (e.g., 1 second)
    payNowBtn.innerText = "Processing...";
    payNowBtn.disabled = true;

    setTimeout(() => {
        // Switch UI to success message
        paymentModal.classList.remove('payment-mode-active');
        paymentModal.classList.add('payment-complete-active');

        // Reset button for next time
        payNowBtn.innerText = `Pay $${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}`;
        payNowBtn.disabled = false;

        // Clear the cart after successful payment
        cart = [];
        saveCart();
        updateCartUI();

    }, 1500); // 1.5 seconds delay
});

// Format Card Number Input (Simple dashes)
const cardNumberInput = document.querySelector('input[placeholder="Card Number (e.g., 1234 5678 1234 5678)"]');
cardNumberInput.addEventListener('input', (e) => {
    let input = e.target.value.replace(/\s/g, ''); // remove existing spaces
    let inputNumbersOnly = input.replace(/\D/g, ''); // remove non-digits

    // Don't format if non-digits entered
    if (input.length > inputNumbersOnly.length) {
        e.target.value = inputNumbersOnly; // Just show numbers
        return;
    }

    // Add space every 4 digits
    let formattedInput = inputNumbersOnly.match(/.{1,4}/g)?.join(' ') || '';
    e.target.value = formattedInput;
});