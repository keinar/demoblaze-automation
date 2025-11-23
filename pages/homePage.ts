import { Locator, Page, expect, test } from '@playwright/test';
import { BasePage } from './basePage';
import { URLS } from '../consts/urls';

export class HomePage extends BasePage {
    readonly productCards: Locator;
    readonly productTitleName: Locator
    readonly categoryLink: Locator
    readonly productPrice: Locator
    readonly productImage: Locator

    constructor(page: Page) {
        super(page);
        this.productCards = page.locator('.card');
        this.productTitleName = page.locator('.card-title a')
        this.categoryLink = page.locator('.list-group-item')
        this.productPrice = page.locator('[class="card-block"] h5')
        this.productImage = page.locator('.card-img-top')

    }

    async navigateToHomePage() {
        await this.navigateTo(URLS.BASE_URL);
    }

    async waitForProductCount(expectedCount: number) {
        await test.step(`Wait for product count to be: ${expectedCount}`, async () => {
            await expect(this.productCards).toHaveCount(expectedCount);
        });
    }

    async selectCategory(categoryName: string) {
        await test.step(`Select category: ${categoryName}`, async () => {
            const categoryLink = this.categoryLink.filter({ hasText: categoryName });
            await this.clickElement(categoryLink);
        });
    }

    async getProductsFromCurrentPage() {
        const allCards = await this.productCards.all();
        return Promise.all(allCards.map(async (card) => {
            return {
                name: (await card.locator(this.productTitleName).textContent())?.trim(),
                price: (await card.locator(this.productPrice).textContent())?.trim(),
                imageVisible: await card.locator(this.productImage).isVisible()
            };
        }));
    }

    async enterProductDetails(productName: string) {
        await test.step(`Enter product details for: ${productName}`, async () => {
            const productLink = this.productTitleName.filter({ hasText: productName });
            await this.clickElement(productLink);
            await this.page.waitForLoadState('domcontentloaded');
        });
    }
}