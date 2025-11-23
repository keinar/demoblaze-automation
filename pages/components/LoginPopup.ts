import { Locator, expect, test, Page } from '@playwright/test';
import { BasePage } from '../../pages/basePage';

export class LoginPopup extends BasePage {
    readonly openLoginLink: Locator;
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        super(page);
        this.openLoginLink = page.locator('#login2');
        this.usernameInput = page.locator('#loginusername');
        this.passwordInput = page.locator('#loginpassword');
        this.loginButton = page.locator('#logInModal .btn-primary');
    }

    async open() {
        await test.step('Open Login Modal', async () => {
            await this.openLoginLink.click();
            await this.usernameInput.waitFor({ state: 'visible' }); 
        });
    }

    async login(username: string, password: string): Promise<void> {
        await test.step('Login to website', async() => {
            // Ensure modal is open before typing
            if (!(await this.usernameInput.isVisible())) {
                 await this.clickElement(this.openLoginLink);
            }
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);
            await this.loginButton.click();
        });
    }
    
    async loginWithInvalidCredentials(username: string, password: string, expectedError: string): Promise<void> {
        await test.step(`Attempt login with invalid credentials: ${username}`, async() => {

            if (!(await this.usernameInput.isVisible())) {
                await this.clickElement(this.openLoginLink);
           }
            
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