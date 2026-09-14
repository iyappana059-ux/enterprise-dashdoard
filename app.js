let products = [];
let filteredProducts = [];

const productContainer = document.getElementById("product-container");
const searchInput = document.getElementById("search-input");
const categoryButtons = document.querySelectorAll(".category-btn");
const sortSelect = document.getElementById("sort-select");
const loading = document.getElementById("loading");
const errorBanner = document.getElementById("error-banner");

// Load products from API
async function loadProducts() {
    showLoading();
    hideError();

    try {
        products = await fetchProducts();
        filteredProducts = [...products];

        localStorage.setItem("products", JSON.stringify(products));

        displayProducts(filteredProducts);
    } catch (error) {
        const cachedProducts = localStorage.getItem("products");

        if (cachedProducts) {
            products = JSON.parse(cachedProducts);
            filteredProducts = [...products];
            displayProducts(filteredProducts);
        } else {
            showError(error.message);
        }
    } finally {
        hideLoading();
    }
}

// Display products in DOM
function displayProducts(productList) {
    productContainer.innerHTML = "";

    if (productList.length === 0) {
        productContainer.innerHTML = `
            <p class="no-results">
                No products found.
            </p>
        `;
        return;
    }

    productList.forEach(product => {
        const article = document.createElement("article");

        article.className = "product-card";

        article.innerHTML = `
            <img 
                src="${product.image}" 
                alt="${product.title}"
                class="product-image"
            >

            <div class="product-info">
                <h3>${product.title}</h3>

                <p class="product-category">
                    ${product.category}
                </p>

                <p class="product-price">
                    $${product.price.toFixed(2)}
                </p>

                <button 
                    type="button"
                    class="add-cart-btn"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>
            </div>
        `;

        productContainer.appendChild(article);
    });

    addCartEvents();
}

// Search filtering
searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase().trim();

    filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchValue)
    );

    applySorting();
});

// Category filtering
categoryButtons.forEach(button => {
    button.addEventListener("click", function () {
        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const category = button.dataset.category;

        if (category === "all") {
            filteredProducts = [...products];
        } else {
            filteredProducts = products.filter(product =>
                product.category === category
            );
        }

        applySorting();
    });
});

// Sorting
sortSelect.addEventListener("change", applySorting);

function applySorting() {
    const sortValue = sortSelect.value;

    if (sortValue === "price-low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (sortValue === "price-high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    if (sortValue === "name") {
        filteredProducts.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    displayProducts(filteredProducts);
}

// Cart using localStorage
function addCartEvents() {
    const cartButtons = document.querySelectorAll(".add-cart-btn");

    cartButtons.forEach(button => {
        button.addEventListener("click", function () {
            const productId = Number(button.dataset.id);

            let cart = JSON.parse(
                localStorage.getItem("cart")
            ) || [];

            if (!cart.includes(productId)) {
                cart.push(productId);

                localStorage.setItem(
                    "cart",
                    JSON.stringify(cart)
                );

                button.textContent = "Added ✓";
            } else {
                button.textContent = "Already Added";
            }
        });
    });
}

// Loading state
function showLoading() {
    loading.hidden = false;
    productContainer.innerHTML = `
        <div class="skeleton-grid">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        </div>
    `;
}

function hideLoading() {
    loading.hidden = true;
}

// Error banner
function showError(message) {
    errorBanner.textContent = message;
    errorBanner.hidden = false;
}

function hideError() {
    errorBanner.hidden = true;
}

// Start application
loadProducts();