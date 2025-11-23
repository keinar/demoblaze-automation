import { test, expect } from '../../fixtures/baseFixture';
import { CATEGORY_TEST_DATA } from '../../consts/categoriesData';
import { EXPECTED_PRODUCTS } from '../../consts/expectedProducts';
import { ERROR_MESSAGES } from '../../consts/errorMessages';


test.describe('Product Catalog Tests', () => {

    test.beforeEach(async ({ homePage }) => {
        await homePage.navigateToHomePage();
    });

    for (const data of CATEGORY_TEST_DATA) {
        test(`Validate products in category: ${data.categoryName}`, async ({homePage}) => {
            await homePage.selectCategory(data.categoryName);
            await homePage.waitForProductCount(data.expectedCount);
            const products = await homePage.getProductsFromCurrentPage();
            expect(products.length).toBe(data.expectedCount);

            products.forEach(product => {
                expect(product.name).toBeTruthy();
                expect(product.price).toContain('$');
                expect(product.imageVisible).toBeTruthy();
            });
        });
    }

    test('Verify that clicking a product navigates to the correct details page', async ({homePage, productPage}) => {
        await homePage.enterProductDetails(EXPECTED_PRODUCTS[0].name);
        await productPage.validateProductTitle(EXPECTED_PRODUCTS[0].name);
        await productPage.validateProductPrice(EXPECTED_PRODUCTS[0].price);
        await productPage.validateProductDescription(EXPECTED_PRODUCTS[0].description!);
    });

    test('Add a product to the cart and verify success alert', async ({homePage, productPage}) => {
        await homePage.enterProductDetails(EXPECTED_PRODUCTS[0].name);
        await productPage.addProductToCartAndVerify();
    });

    test('Login with invalid credentials', async ({loginPopup}) => {
        await loginPopup.loginWithInvalidCredentials('invalidUser','invalidPass', ERROR_MESSAGES[0].invalid_credentails)
    });
});