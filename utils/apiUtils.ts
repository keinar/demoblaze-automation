import { test } from "@playwright/test";
import { APIRequestContext } from "@playwright/test";
import { URLS } from "../consts/urls";
import { Product } from "../interfaces/product.interface";

export class ApiUtils {
    readonly request: APIRequestContext;
    readonly PRODUCTS = `${URLS.API_URL}${URLS.API_ENDPOINTS.PRODUCTS}` 
    readonly CART = `${URLS.API_URL}${URLS.API_ENDPOINTS.CART}`

    constructor(request: APIRequestContext) {
        this.request = request;
    }

    async getAllProducts() {
        return await test.step('Get all products from API', async () => {
            const response = await this.request.get(this.PRODUCTS);
            return response;
        });
    }

    async addItemToCart(item: Product) {
        return await test.step('Add item to cart via API', async () => {
            const response = await this.request.post(this.CART, { 
                data: item 
            });
            return response;
        });
    }

    async getCartItems() {
        return await test.step('Get all items from cart via API', async () => {
            const response = await this.request.get(this.CART);
            return response;
        });
    }

    async deleteCartItem(id: string | number) {
        return await test.step(`DELETE /cart/${id}`, async () => {
            return await this.request.delete(this.CART);
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