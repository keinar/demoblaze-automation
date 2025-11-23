import { test as base } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { ProductPage } from '../pages/productPage';
import { LoginPopup } from '../pages/components/LoginPopup';
import { ApiUtils } from '../utils/apiUtils';

type MyFixtures = {
    homePage: HomePage;
    productPage: ProductPage;
    loginPopup: LoginPopup;
    apiUtils: ApiUtils;
};

export const test = base.extend<MyFixtures>({
    
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },

    loginPopup: async ({ page }, use) => {
        await use(new LoginPopup(page));
    },

    apiUtils: async ({ request }, use) => {
        const utils = new ApiUtils(request);
        await use(utils);
    },
});

export { expect } from '@playwright/test';