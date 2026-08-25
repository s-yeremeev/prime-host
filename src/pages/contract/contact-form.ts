import { Page } from '@playwright/test';

export interface ContactFormData {
  typeName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCountryIso: string;
  phoneNumber: string;
  comment?: string;
}

const CHECKBOX_LABEL = {
  promotionalEmails: 'Send promotional emails (usually once a month)',
  productEmails: 'Send product emails (domain registrations, renewals, failures, etc.)',
  financialEmails: 'Send financial emails (balance notifications)',
} as const;

/**
 * The Add and Edit contact pages share the exact same form markup, so one
 * page object drives both.
 */
export class ContactFormBlock {
  constructor(private readonly page: Page) {}

  private field(label: string) {
    return this.page
      .locator('div.relative', { has: this.page.locator('label', { hasText: label }) })
      .locator('input');
  }

  get typeNameInput() {
    return this.field('Contact type/NAME');
  }

  get firstNameInput() {
    return this.field('First Name');
  }

  get lastNameInput() {
    return this.field('Last Name');
  }

  get emailInput() {
    return this.field('Email');
  }

  get phoneNumberInput() {
    return this.field('Phone number');
  }

  get commentInput() {
    return this.field('Comment');
  }

  private checkbox(label: string) {
    return this.page.getByRole('checkbox', { name: label });
  }

  get promotionalEmailsCheckbox() {
    return this.checkbox(CHECKBOX_LABEL.promotionalEmails);
  }

  get productEmailsCheckbox() {
    return this.checkbox(CHECKBOX_LABEL.productEmails);
  }

  get financialEmailsCheckbox() {
    return this.checkbox(CHECKBOX_LABEL.financialEmails);
  }

  async fill(data: ContactFormData) {
    await this.typeNameInput.fill(data.typeName);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    await this.selectPhoneCountry(data.phoneCountryIso);
    await this.phoneNumberInput.fill(data.phoneNumber);
    if (data.comment !== undefined) {
      await this.commentInput.fill(data.comment);
    }
  }

  async selectPhoneCountry(iso: string) {
    await this.page.locator('.country-intl-input').click();
    await this.page.locator(`li.vue-country-item[data-iso="${iso}"]`).click();
  }

  private async setCheckbox(label: string, checked: boolean) {
    if ((await this.checkbox(label).isChecked()) !== checked) {
      // The visual checkbox square sits on top of the native input, so the
      // input itself isn't clickable — its label is.
      await this.page.locator('label.va-checkbox__label', { hasText: label }).click();
    }
  }

  async setPromotionalEmails(checked: boolean) {
    await this.setCheckbox(CHECKBOX_LABEL.promotionalEmails, checked);
  }

  async setProductEmails(checked: boolean) {
    await this.setCheckbox(CHECKBOX_LABEL.productEmails, checked);
  }

  async setFinancialEmails(checked: boolean) {
    await this.setCheckbox(CHECKBOX_LABEL.financialEmails, checked);
  }

  async submitCreate() {
    await this.page.getByRole('button', { name: 'Create' }).click();
  }

  async submitSave() {
    await this.page.getByRole('button', { name: 'Save' }).click();
    await this.page.waitForURL('**/contacts');
  }
}
