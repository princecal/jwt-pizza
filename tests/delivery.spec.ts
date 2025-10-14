import { test, expect } from 'playwright-test-coverage';
import { User, Role } from '../src/service/pizzaService';
import { Page } from '@playwright/test';

test('deliveryFail', async ({page}) => {
    await page.goto('/delivery');
    await expect(page.getByText('VerifyOrder moreorder ID: pie')).toBeVisible();
    await expect(page.getByText('error', { exact: true })).toBeVisible();
    await page.goto('/');
});