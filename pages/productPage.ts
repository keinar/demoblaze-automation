import { Locator, Page, expect, test } from '@playwright/test';
import { BasePage } from './basePage';
import { URLS } from '../consts/urls';
import { HOME_SELECTORS, PRODUCT_SELECTORS } from '../consts/selectors';

export class ProductPage extends BasePage {

    private get productTitle(): Locator {
        return this.page.locator(PRODUCT_SELECTORS.PRODUCT_NAME_TITLE);
    }

    private get productPrice(): Locator {
        return this.page.locator(PRODUCT_SELECTORS.PRODUCT_PRICE);
    }

    private get productDescription(): Locator {
        return this.page.locator(PRODUCT_SELECTORS.PRODUCT_DESCRIPTION);
    }

    private get addToCartButton(): Locator {
        return this.page.getByRole('link', { name: 'Add to cart' });
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

    async addProductToCart() {
        await test.step('Add product to cart', async () => {
            await this.clickElement(this.addToCartButton);
            await this.page.waitForLoadState('domcontentloaded');
        });
    }

    async validateAddToCartSuccessAlert() {
        await test.step('Validate add to cart success alert', async () => {
            this.page.on('dialog', async dialog => {
                expect(dialog.message()).toContain('Product added');
                await dialog.accept();
            });
        });
    }
}



