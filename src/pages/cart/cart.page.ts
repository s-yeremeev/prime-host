import { Page } from '@playwright/test';
import { parsePrice } from '../../utils/price';

export class CartPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/cart', { waitUntil: 'networkidle' });
  }

  get rows() {
    return this.page.locator('table tbody tr');
  }

  async isEmpty(): Promise<boolean> {
    return (await this.page.getByRole('heading', { name: 'Cart is empty' }).count()) > 0;
  }

  async total(): Promise<number> {
    if (await this.isEmpty()) return 0;
    const text = await this.page.getByText(/^TOTAL:\s*\$[\d,]+\.\d{2}$/).innerText();
    return parsePrice(text);
  }

  /** Removes every item currently in the cart, leaving it empty. */
  async clear() {
    while (!(await this.isEmpty())) {
      const removed = this.page.waitForResponse(
        (res) => res.request().method() === 'DELETE' && /\/api\/cart\/remove\/\d+$/.test(res.url())
      );
      await this.rows.first().getByRole('cell').last().getByRole('button').click();
      await removed;
    }
  }
}
