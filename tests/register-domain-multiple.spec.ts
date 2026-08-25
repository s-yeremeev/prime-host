import { test, expect } from '../src/fixture/pages.fixture';
import { faker } from '@faker-js/faker';

test.describe('Register domain — add multiple domains to cart', () => {
  test.beforeEach(async ({ cart }) => {
    await cart.goto();
    await cart.clear();
  });

  test.afterEach(async ({ cart }) => {
    await cart.goto();
    await cart.clear();
  });

  /*
   1. Search by keyword only (no TLD) — results mix free and taken domains.
   2. Pick the first 3 rows that are actually purchasable (availableRows).
   3. Read each row's price, then add it to the cart (priceOf + addToCart).
   4. Open the cart and assert TOTAL equals the sum collected in step 3.
   */
  test('cart TOTAL matches the sum of 3 domains added from a TLD-less search', async ({
    registerDomain,
    cart,
  }) => {
    const keyword = `qa-${faker.string.alphanumeric(10).toLowerCase()}`;

    await registerDomain.goto();
    await registerDomain.search(keyword);

    const rows = await registerDomain.availableRows(3);
    expect(rows).toHaveLength(3);

    let expectedTotal = 0;
    for (const row of rows) {
      expectedTotal += await registerDomain.priceOf(row);
      await registerDomain.addToCart(row);
    }

    await cart.goto();

    expect(await cart.total()).toBeCloseTo(expectedTotal, 2);
  });
});
