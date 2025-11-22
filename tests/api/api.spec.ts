import { test, expect } from '@playwright/test';
import { ApiUtils } from '../../utils/apiUtils';

test.describe('API Tests for Product Catalog', () => {
    let apiUtils: ApiUtils;
    let testProduct: any;

    test.beforeEach(async ({ request }) => {
        apiUtils = new ApiUtils(request);
        await apiUtils.emptyCart();
        const productsResponse = await apiUtils.getAllProducts();
        expect(productsResponse.status()).toBe(200);
        const productsBody = await productsResponse.json();
        testProduct = productsBody[0];
    });

    test('Validate fetching all products from API', async () => {
        const productsResponse = await apiUtils.getAllProducts();
        expect(productsResponse.status()).toBe(200);
        const productsBody = await productsResponse.json();
        
        expect(productsBody.length).toBeGreaterThan(0);
        expect(productsBody[0]).toHaveProperty('title');
    });

    test('Add a product to the cart and verify via API', async () => {
        const addResponse = await apiUtils.addItemToCart(testProduct);
        
        expect(addResponse.status()).toBe(201); 
        const addedProductBody = await addResponse.json();
        expect(addedProductBody.title).toBe(testProduct.title);
    });

    test('Retrieve cart items and validate contents', async () => {
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