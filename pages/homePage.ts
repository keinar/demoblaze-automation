import { Locator, Page, expect, test } from '@playwright/test';
import { BasePage } from './basePage';
import { URLS } from '../consts/urls';
import { HOME_SELECTORS } from '../consts/selectors';

export class HomePage extends BasePage {

    private get productCards(): Locator {
        return this.page.locator(HOME_SELECTORS.PRODUCT_CARD);
    }

    async navigateToHomePage() {
        await this.navigateTo(URLS.BASE_URL);
    }

    async selectCategory(categoryName: string) {
        await test.step(`Select category: ${categoryName}`, async () => {
            const categoryLink = this.page.locator(HOME_SELECTORS.CATEGORY_LINK, { hasText: categoryName });
            await this.clickElement(categoryLink);
            await this.page.waitForLoadState('domcontentloaded');
            await this.productCards.first().waitFor({ state: 'visible' });
        });
    }

    async getProductsFromCurrentPage() {
        const productsCount = await this.productCards.count();
        const products = [];
        
        for (let i = 0; i < productsCount; i++) {
            const productCard = this.productCards.nth(i);
            const name = await productCard.locator(HOME_SELECTORS.PRODUCT_NAME).textContent();
            const price = await productCard.locator(HOME_SELECTORS.PRODUCT_PRICE).textContent();
            const imageVisible = await productCard.locator(HOME_SELECTORS.PRODUCT_IMAGE).isVisible();
            
            products.push({ 
                name: name?.trim(), 
                price: price?.trim(),
                imageVisible 
            });
        }
        return products;
    }

    async enterProductDetails(productName: string) {
        await test.step(`Enter product details for: ${productName}`, async () => {
            const productLink = this.page.locator(HOME_SELECTORS.PRODUCT_NAME, { hasText: productName });
            await this.clickElement(productLink);
            await this.page.waitForLoadState('domcontentloaded');
        });
    }
}