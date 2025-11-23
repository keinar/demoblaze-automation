import { Locator, expect, test } from '@playwright/test';
import { BasePage } from '../../pages/basePage';
import { LOGIN_POPUP_SELECTORS } from '../../consts/selectors';

export class LoginPopup extends BasePage {

    private get openLoginLink(): Locator {
        return this.page.locator(LOGIN_POPUP_SELECTORS.LINK_TO_OPEN_LOGIN);
    }

    private get usernameInput(): Locator {
        return this.page.locator(LOGIN_POPUP_SELECTORS.USERNAME_INPUT);
    }

    private get passwordInput(): Locator {
        return this.page.locator(LOGIN_POPUP_SELECTORS.PASSWORD_INPUT);
    }

    private get loginButton(): Locator {
        return this.page.locator(LOGIN_POPUP_SELECTORS.LOGIN_BUTTON);
    }

    private get openLoginModal(): Locator {
        return this.page.locator(LOGIN_POPUP_SELECTORS.LINK_TO_OPEN_LOGIN)
    }

    async open() {
        await test.step('Open Login Modal', async () => {
            await this.openLoginLink.click();
            await this.usernameInput.waitFor({ state: 'visible' }); 
        });
    }

    async login(username: string, password: string): Promise<void> {
        await test.step('Login to website', async() => {
            await this.clickElement(this.openLoginModal)
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);
            await this.loginButton.click();
        });
    }
    
    async loginWithInvalidCredentials(username: string, password: string, expectedError: string): Promise<void> {
        await test.step(`Attempt login with invalid credentials: ${username}`, async() => {
            await this.clickElement(this.openLoginModal)
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);
            
            const dialogPromise = this.page.waitForEvent('dialog');
            await this.loginButton.click();
            
            const dialog = await dialogPromise;
            expect(dialog.message()).toContain(expectedError);
            await dialog.accept();
        });
    }
}