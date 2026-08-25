import { test, expect } from '../src/fixture/pages.fixture';
import { faker } from '@faker-js/faker';
import { ContactFormData } from '../src/pages/contract/contact-form';

function buildContact(): ContactFormData {
  // Contact type/NAME rejects digits, so the suffix must be letters only.
  const suffix = faker.string.alpha(8);
  return {
    typeName: `QA Contact ${suffix}`,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    phoneCountryIso: 'ua',
    phoneNumber: faker.string.numeric(9),
    comment: 'created by automated test',
  };
}

test.describe('Contacts', () => {
  test('creates a new contact', async ({ contacts }) => {
    const data = buildContact();

    await contacts.create(data);

    await expect(contacts.row(data.typeName)).toBeVisible();
    await expect(contacts.row(data.typeName)).toContainText(data.email);

    await contacts.delete(data.typeName);
  });

  test('edits an existing contact, including checkbox state', async ({ contacts }) => {
    const data = buildContact();
    const form = contacts.form;

    await contacts.create(data, async () => {
      await form.setPromotionalEmails(false);
      await form.setProductEmails(true);
    });

    const updatedLastName = `${data.lastName}Edited`;

    await contacts.openEditForm(data.typeName);
    await form.lastNameInput.fill(updatedLastName);
    await form.setFinancialEmails(true);
    await form.submitSave();

    await contacts.openEditForm(data.typeName);
    await expect(form.lastNameInput).toHaveValue(updatedLastName);
    await expect(form.promotionalEmailsCheckbox).not.toBeChecked();
    await expect(form.productEmailsCheckbox).toBeChecked();
    await expect(form.financialEmailsCheckbox).toBeChecked();

    await contacts.goto();
    await contacts.delete(data.typeName);
  });

  test('deletes an existing contact', async ({ contacts }) => {
    const data = buildContact();

    await contacts.create(data);
    await expect(contacts.row(data.typeName)).toBeVisible();

    await contacts.delete(data.typeName);

    await expect(contacts.row(data.typeName)).toHaveCount(0);
    // Default contacts must remain untouched by any delete flow.
    await expect(contacts.row('Primary')).toBeVisible();
    await expect(contacts.row('Abuse')).toBeVisible();
  });
});
