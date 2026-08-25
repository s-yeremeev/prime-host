import { test, expect } from '../src/fixture/pages.fixture';
import { faker } from '@faker-js/faker';

const TLDS = ['com', 'net', 'org'];

test.describe('Register domain — add a single domain to cart', () => {
  test.beforeEach(async ({ cart }) => {
    await cart.goto();
    await cart.clear();
  });

  test.afterEach(async ({ cart }) => {
    await cart.goto();
    await cart.clear();
  });

  for (const tld of TLDS) {
    test(`price shown for a .${tld} domain matches the cart TOTAL after adding it`, async ({
      registerDomain,
      cart,
    }) => {
      const domain = `qa-${faker.string.alphanumeric(10).toLowerCase()}.${tld}`;

      await registerDomain.goto();
      await registerDomain.search(domain);

      const row = registerDomain.domainRow(domain);
      await expect(row.getByRole('button', { name: 'Add to cart' })).toBeVisible();

      const searchPagePrice = await registerDomain.priceOf(row);
      await registerDomain.addToCart(row);

      await cart.goto();

      expect(await cart.total()).toBeCloseTo(searchPagePrice, 2);
    });
  }
});
