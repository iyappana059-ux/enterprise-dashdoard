const API_URL = "https://fakestoreapi.com/products";

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const products = await response.json();
        return products;

    } catch (error) {
        throw new Error("Unable to load products. Please try again.");
    }
}