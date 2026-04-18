import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
  await request.post('/test/clear');
});

test.describe('Landing Page', () => {

  test('should display the landing page with correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Grocery Flow/);
  });

  test('should show welcome heading and description', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Organize Your Grocery Shopping');
    await expect(page.locator('.landing p')).toContainText('Create and manage your grocery lists');
  });

  test('should show View Lists and Create a List buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.landing-buttons a[href="/lists"]')).toBeVisible();
    await expect(page.locator('.landing-buttons a[href="/lists/new"]')).toBeVisible();
  });

  test('should show navigation links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[href="/"]')).toBeVisible();
    await expect(page.locator('nav a[href="/lists"]')).toBeVisible();
    await expect(page.locator('nav a[href="/lists/new"]')).toBeVisible();
  });

});

test.describe('Create List', () => {

  test('should load the create list form', async ({ page }) => {
    await page.goto('/lists/new');
    await expect(page).toHaveTitle(/Create List/);
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('textarea#description')).toBeVisible();
  });

  test('should create a new list and redirect to View Lists', async ({ page }) => {
    await page.goto('/lists/new');
    await page.fill('input#name', 'Weekly Groceries');
    await page.fill('textarea#description', 'Shopping for the week');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/lists');
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.locator('tbody tr td:first-child')).toContainText('Weekly Groceries');
  });

  test('should create a list with no description', async ({ page }) => {
    await page.goto('/lists/new');
    await page.fill('input#name', 'Quick Run');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/lists');
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.locator('tbody tr td:first-child')).toContainText('Quick Run');
  });

});

test.describe('View Lists', () => {

  test('should show empty state when no lists exist', async ({ page }) => {
    await page.goto('/lists');
    await expect(page).toHaveTitle(/My Lists/);
    await expect(page.locator('table')).not.toBeVisible();
    await expect(page.locator('.page')).toContainText('No lists yet');
  });

  test('should display table with correct column headers', async ({ page }) => {
    await page.goto('/lists/new');
    await page.fill('input#name', 'Test List');
    await page.fill('textarea#description', 'A test description');
    await page.click('button[type="submit"]');

    await expect(page.locator('th', { hasText: 'List Name' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Description' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Created' })).toBeVisible();
    await expect(page.locator('th', { hasText: 'Actions' })).toBeVisible();
  });

  test('should show View and Delete buttons for each list', async ({ page }) => {
    await page.goto('/lists/new');
    await page.fill('input#name', 'Button Test List');
    await page.click('button[type="submit"]');

    await expect(page.locator('a.btn-outline').first()).toBeVisible();
    await expect(page.locator('button.btn-danger').first()).toBeVisible();
  });

  test('should delete a list and remove it from the table', async ({ page }) => {
    await page.goto('/lists/new');
    await page.fill('input#name', 'To Be Deleted');
    await page.click('button[type="submit"]');

    await expect(page.locator('tbody tr')).toHaveCount(1);

    page.on('dialog', dialog => dialog.accept());
    await page.locator('button.btn-danger').first().click();

    await expect(page.locator('.page')).toContainText('No lists yet');
  });

});

test.describe('List Detail Page', () => {

  test('should navigate to list detail page from View Lists', async ({ page }) => {
    await page.goto('/lists/new');
    await page.fill('input#name', 'My Detail List');
    await page.click('button[type="submit"]');

    await page.locator('a.btn-outline').first().click();
    await expect(page.locator('h2')).toContainText('My Detail List');
    await expect(page.locator('input#name')).toBeVisible();
    await expect(page.locator('select#category')).toBeVisible();
    await expect(page.locator('input#quantity')).toBeVisible();
  });

  test('should add an item to the list', async ({ page }) => {
    await page.goto('/lists/new');
    await page.fill('input#name', 'Shopping List');
    await page.click('button[type="submit"]');
    await page.locator('a.btn-outline').first().click();

    await page.fill('input#name', 'Apples');
    await page.selectOption('select#category', 'Produce');
    await page.fill('input#quantity', '3');
    await page.click('button[type="submit"]');

    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.locator('tbody tr td:first-child')).toContainText('Apples');
    await expect(page.locator('tbody tr td:nth-child(2)')).toContainText('Produce');
    await expect(page.locator('tbody tr td:nth-child(3)')).toContainText('3');
  });

  test('should mark an item as purchased', async ({ page }) => {
    await page.goto('/lists/new');
    await page.fill('input#name', 'Purchased Test');
    await page.click('button[type="submit"]');
    await page.locator('a.btn-outline').first().click();

    await page.fill('input#name', 'Milk');
    await page.click('button[type="submit"]');

    await page.locator('input[type="checkbox"]').first().click();
    await expect(page.locator('input[type="checkbox"]').first()).toBeChecked();
  });

  test('should delete an item from the list', async ({ page }) => {
    await page.goto('/lists/new');
    await page.fill('input#name', 'Delete Item Test');
    await page.click('button[type="submit"]');
    await page.locator('a.btn-outline').first().click();

    await page.fill('input#name', 'Bread');
    await page.click('button[type="submit"]');

    await expect(page.locator('tbody tr')).toHaveCount(1);

    page.on('dialog', dialog => dialog.accept());
    await page.locator('button.btn-danger').first().click();

    await expect(page.locator('.page')).toContainText('No items yet');
  });

});