import { Page } from '@playwright/test';
import { ContactFormData, ContactFormBlock } from './contact-form';

export class ContactsPage {
  readonly form: ContactFormBlock;

  constructor(private readonly page: Page) {
    this.form = new ContactFormBlock(page);
  }

  async goto() {
    await this.page.goto('/contacts');
  }

  get addNewContactButton() {
    return this.page.getByRole('button', { name: '+ Add New Contact' });
  }

  row(name: string) {
    return this.page.getByRole('row', { name });
  }

  async openAddForm() {
    await this.addNewContactButton.click();
    await this.page.waitForURL('**/contacts/add');
  }

  async create(data: ContactFormData, beforeSubmit?: () => Promise<void>) {
    await this.goto();
    await this.openAddForm();
    await this.form.fill(data);
    if (beforeSubmit) {
      await beforeSubmit();
    }
    await this.form.submitCreate();
    await this.page.waitForURL('**/contacts');
  }

  async openEditForm(name: string) {
    // The form is hydrated from this request; editing before it resolves
    // gets silently overwritten once it lands.
    const contactLoaded = this.page.waitForResponse((res) => /\/api\/contacts\/\d+$/.test(res.url()));
    await this.row(name).getByRole('button').nth(0).click();
    await this.page.waitForURL('**/contacts/edit/*');
    await contactLoaded;
  }

  async delete(name: string) {
    await this.row(name).getByRole('button').nth(1).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'OK' }).click();
  }
}
