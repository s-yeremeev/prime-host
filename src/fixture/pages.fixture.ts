import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { ContactsPage } from '../pages/contract/contacts.page';
import { RegisterDomainPage } from '../pages/domain/register-domain.page';
import { CartPage } from '../pages/cart/cart.page';

type Pages = {
  login: LoginPage;
  contacts: ContactsPage;
  registerDomain: RegisterDomainPage;
  cart: CartPage;
};

export const test = base.extend<Pages>({
  login: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  contacts: async ({ page }, use) => {
    await use(new ContactsPage(page));
  },
  registerDomain: async ({ page }, use) => {
    await use(new RegisterDomainPage(page));
  },
  cart: async ({ page }, use) => {
    await use(new CartPage(page));
  },
});

export { expect } from '@playwright/test';
