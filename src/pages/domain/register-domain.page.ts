import { Locator, Page } from '@playwright/test';
import { parsePrice } from '../../utils/price';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class RegisterDomainPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/register-domain');
  }

  get searchBox() {
    return this.page.getByPlaceholder('Enter domain name or keyword');
  }

  get resultsList() {
    return this.page.locator('.va-list[role="list"]');
  }

  async search(query: string) {
    await this.searchBox.click();
    await this.searchBox.pressSequentially(query, { delay: 40 });
    await this.searchBox.press('Enter');
    await this.resultsList.getByRole('listitem').first().waitFor();
  }

  domainRow(domain: string): Locator {
    return this.resultsList.getByRole('listitem').filter({
      has: this.page.locator('.domain-name .break-all', {
        hasText: new RegExp(`^${escapeRegExp(domain)}$`),
      }),
    });
  }

  /** First `limit` rows that are actually purchasable (have an "Add to
   *  cart" button, unlike taken domains which only offer "Whois"). */
  async availableRows(limit: number): Promise<Locator[]> {
    const items = this.resultsList.getByRole('listitem');
    const count = await items.count();
    const rows: Locator[] = [];
    for (let i = 0; i < count && rows.length < limit; i++) {
      const item = items.nth(i);
      if (await item.getByRole('button', { name: 'Add to cart' }).count()) {
        rows.push(item);
      }
    }
    return rows;
  }

  async domainNameOf(row: Locator): Promise<string> {
    return (await row.locator('.domain-name .break-all').innerText()).trim();
  }

  async priceOf(row: Locator): Promise<number> {
    const text = await row.locator('.text-sm.font-medium').last().innerText();
    return parsePrice(text);
  }
  async addToCart(row: Locator) {

    await row.getByRole('button', { name: 'Add to cart' }).click();

    // Some TLDs (e.g. .net) interrupt with a "REGISTRATION NOTICE" dialog
    // that must be accepted before the domain is actually added.
    const agreeButton = this.page.getByRole('button', { name: 'I AGREE, ADD DOMAIN TO CART' });
    const noticeShown = await agreeButton
      .waitFor({ timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    if (noticeShown) {
      await agreeButton.click();
    }

    const toast = this.page.getByText('Domain has been added to cart').first();
    await toast.waitFor({ timeout: 10_000 });
    // The cart is only updated by an async backend step that lands a couple
    // of seconds after the toast — /api/cart/get is empty until it lands.
    await this.page.waitForTimeout(3000);
  }
}
