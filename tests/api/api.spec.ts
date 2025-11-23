import { test, expect } from '../../fixtures/baseFixture';
import { Product } from '../../interfaces/product.interface';

test.describe('API Tests for Product Catalog', () => {
    let testProduct: Product;

    test.beforeEach(async ({ apiUtils }) => {
        await apiUtils.emptyCart();

        const productsResponse = await apiUtils.getAllProducts();
        expect(productsResponse.status()).toBe(200);
        const productsBody = await productsResponse.json();
        testProduct = productsBody[0];
    });

    test('Validate fetching all products from API', async ({apiUtils}) => {
        const productsResponse = await apiUtils.getAllProducts();
        expect(productsResponse.status()).toBe(200);
        const productsBody = await productsResponse.json();
        
        expect(productsBody.length).toBeGreaterThan(0);
        expect(productsBody[0]).toHaveProperty('title');
    });

    test('Add a product to the cart and verify via API', async ({apiUtils}) => {
        const addResponse = await apiUtils.addItemToCart(testProduct);
        
        expect(addResponse.status()).toBe(201); 
        const addedProductBody = await addResponse.json();
        expect(addedProductBody.title).toBe(testProduct.title);
    });

    test('Retrieve cart items and validate contents', async ({apiUtils}) => {
        await apiUtils.addItemToCart(testProduct);

        const cartResponse = await apiUtils.getCartItems();
        expect(cartResponse.status()).toBe(200);

        const cartBody = await cartResponse.json();
        expect(cartBody.length).toBeGreaterThan(0);
        
        const foundItem = cartBody.find((item: any) => item.title === testProduct.title);
        expect(foundItem).toBeTruthy();
        expect(foundItem.price).toBe(testProduct.price);
    });
});

test.describe('Edge Cases & Performance', () => {

    test.beforeEach(async ({ apiUtils }) => {
        await apiUtils.emptyCart();
    });

    test('Negative Scenario: Delete a non-existent item from cart', async ({ apiUtils }) => {
        const nonExistentId = 999999;
        const response = await apiUtils.deleteCartItem(nonExistentId);
        expect(response.status()).toBe(404);
    });

    test('Performance Test: Measure response time for fetching all products', async ({apiUtils}) => {
        const startTime = Date.now();
        const response = await apiUtils.getAllProducts();
        const endTime = Date.now();
        
        expect(response.status()).toBe(200);
        const duration = endTime - startTime;
        console.log(`Response time for fetching all products: ${duration} ms`);
        expect(duration).toBeLessThan(500);
    });
});