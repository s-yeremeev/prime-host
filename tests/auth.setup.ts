import { test as setup } from '../src/fixture/pages.fixture';

export const STORAGE_STATE = 'playwright/.auth/user.json';

setup('authenticate', async ({ page, login }) => {
  const user = process.env.USER;
  const password = process.env.PASSWORD;
  if (!user || !password) {
    throw new Error('USER and PASSWORD must be set in .env');
  }

  await login.goto();
  await login.login(user, password);

  await page.context().storageState({ path: STORAGE_STATE });
});
