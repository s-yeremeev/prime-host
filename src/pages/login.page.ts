import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(user: string, password: string) {
    await this.page.getByRole('textbox', { name: 'email' }).fill(user);
    await this.page.getByRole('textbox', { name: 'password' }).fill(password);
    await this.page.locator('form').getByRole('button', { name: 'Login' }).click();
    await this.page.waitForURL('**/domains');
  }
}
