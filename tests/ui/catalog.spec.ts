import { expect, test } from '@playwright/test';
import { HomePage } from '../../pages/homePage';
import { ProductPage } from '../../pages/productPage';
import { CATEGORY_TEST_DATA } from '../../consts/categoriesData';
import { EXPECTED_PRODUCTS } from '../../consts/expectedProducts';


test.describe('Product Catalog Tests', () => {
    let homePage: HomePage;
    let productPage: ProductPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productPage = new ProductPage(page);
        await homePage.navigateToHomePage();
    });

    for (const data of CATEGORY_TEST_DATA) {
        test(`Validate products in category: ${data.categoryName}`, async () => {
            await homePage.selectCategory(data.categoryName);
            const products = await homePage.getProductsFromCurrentPage();
            expect(products.length).toBe(data.expectedCount);

            products.forEach(product => {
                expect(product.name).toBeTruthy();
                expect(product.price).toContain('$');
                expect(product.imageVisible).toBeTruthy();
            });
        });
    }

    test('Verify that clicking a product navigates to the correct details page', async () => {
        await homePage.enterProductDetails(EXPECTED_PRODUCTS[0].name);
        await productPage.validateProductTitle(EXPECTED_PRODUCTS[0].name);
        await productPage.validateProductPrice(EXPECTED_PRODUCTS[0].price);
        await productPage.validateProductDescription(EXPECTED_PRODUCTS[0].description!);
    });
});