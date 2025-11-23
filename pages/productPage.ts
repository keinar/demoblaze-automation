import { Locator, Page, expect, test } from '@playwright/test';
import { BasePage } from './basePage';

export class ProductPage extends BasePage {
    readonly productTitle: Locator;
    readonly productPrice: Locator;
    readonly productDescription: Locator;
    readonly addToCartButton: Locator;

    constructor(page: Page) {
        super(page);
        this.productTitle = page.locator('.product-content');
        this.productPrice = page.locator('.product-content .price-container');
        this.productDescription = page.locator('#myTabContent p');
        this.addToCartButton = page.getByRole('link', { name: 'Add to cart' });
    }

    async validateProductTitle(expectedTitle: string) {
        await test.step(`Validate product title is: ${expectedTitle}`, async () => {
            await this.validateElementText(this.productTitle, expectedTitle);
        });
    }

    async validateProductPrice(expectedPrice: string) {
        await test.step(`Validate product price contains: ${expectedPrice}`, async () => {
            const priceText = await this.getElementText(this.productPrice);
            expect(priceText).toContain(expectedPrice);
        });
    }

    async validateProductDescription(expectedDescription: string) {
        await test.step('Validate product description', async () => {
            await expect(this.productDescription).toContainText(expectedDescription);
        });
    }

    async addProductToCartAndVerify() {
        await test.step('Add product to cart and verify success alert', async () => {
            const dialogPromise = this.page.waitForEvent('dialog');
            await this.clickElement(this.addToCartButton);
            const dialog = await dialogPromise;
            expect(dialog.message()).toContain('Product added');
            await dialog.accept();
        });
    }
}