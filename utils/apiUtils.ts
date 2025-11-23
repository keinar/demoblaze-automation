import { test } from "@playwright/test";
import { APIRequestContext } from "@playwright/test";
import { URLS } from "../consts/urls";
import { Product } from "../interfaces/product.interface";

export class ApiUtils {
    readonly request: APIRequestContext;

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getAllProducts() {
        return await test.step('Get all products from API', async () => {
            const response = await this.request.get(`${URLS.API_URL}${URLS.API_ENDPOINTS.PRODUCTS}`);
            return response;
        });
    }

    async addItemToCart(item: Product) {
        return await test.step('Add item to cart via API', async () => {
            const response = await this.request.post(`${URLS.API_URL}${URLS.API_ENDPOINTS.CART}`, { 
                data: item 
            });
            return response;
        });
    }

    async getCartItems() {
        return await test.step('Get all items from cart via API', async () => {
            const response = await this.request.get(`${URLS.API_URL}${URLS.API_ENDPOINTS.CART}`);
            return response;
        });
    }

    async deleteCartItem(id: string | number) {
        return await test.step(`DELETE /cart/${id}`, async () => {
            return await this.request.delete(`${URLS.API_URL}${URLS.API_ENDPOINTS.CART}/${id}`);
        });
    }

    async emptyCart() {
        await test.step('Cleanup: Empty the cart', async () => {
            const response = await this.getCartItems();
            const items = await response.json();
            
            for (const item of items) {
                await this.deleteCartItem(item.id);
            }
        });
    }
}