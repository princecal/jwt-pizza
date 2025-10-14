import { test, expect } from 'playwright-test-coverage';
import { Page } from '@playwright/test';

test('updateUser', async ({ page }) => {
    const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
    await page.goto('/');
    await page.getByRole('link', { name: 'Register' }).click();
    await page.getByRole('textbox', { name: 'Full name' }).fill('pizza diner');
    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('diner');
    await page.getByRole('button', { name: 'Register' }).click();

    await page.getByRole('link', { name: 'pd' }).click();

    await expect(page.getByRole('main')).toContainText('pizza diner');
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.locator('h3')).toContainText('Edit user');
    await page.getByRole('button', { name: 'Update' }).click();

    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza diner');
    await page.getByRole('button', { name: 'Edit' }).click();
    await expect(page.locator('h3')).toContainText('Edit user');
    await page.getByRole('textbox').first().fill('pizza dinerx');
    await page.getByRole('button', { name: 'Update' }).click();

    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza dinerx');
    await page.getByRole('link', { name: 'Logout' }).click();
    await page.getByRole('link', { name: 'Login' }).click();

    await page.getByRole('textbox', { name: 'Email address' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill('diner');
    await page.getByRole('button', { name: 'Login' }).click();

    await page.getByRole('link', { name: 'pd' }).click();

    await expect(page.getByRole('main')).toContainText('pizza dinerx');
});


async function franchiseInit(page:Page){
    await page.route('*/**/api/auth', async (route) => {
        expect(route.request().method()).toBe('PUT');
        await route.fulfill({json: {
  "user": {
    "id": 3,
    "name": "pizza franchisee",
    "email": "f@jwt.com",
    "roles": [
      {
        "role": "diner"
      },
      {
        "objectId": 1,
        "role": "franchisee"
      }
    ]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InBpenphIGZyYW5jaGlzZWUiLCJlbWFpbCI6ImZAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifSx7Im9iamVjdElkIjoxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9XSwiaWF0IjoxNzYwNDUzNTg0fQ.Pl9kEnndmlAKm8uuXEcZZLsPvzbETK__Yqxa6tcjVnQ"
}})
});
    await page.route('*/**/api/auth', async (route) => {
        expect(route.request().method()).toBe('PUT');
        await route.fulfill({json: {
  "user": {
    "id": 3,
    "name": "pizza franchisee",
    "email": "f@jwt.com",
    "roles": [
      {
        "role": "diner"
      },
      {
        "objectId": 1,
        "role": "franchisee"
      }
    ]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywibmFtZSI6InBpenphIGZyYW5jaGlzZWUiLCJlbWFpbCI6ImZAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifSx7Im9iamVjdElkIjoxLCJyb2xlIjoiZnJhbmNoaXNlZSJ9XSwiaWF0IjoxNzYwNDUzNTg0fQ.Pl9kEnndmlAKm8uuXEcZZLsPvzbETK__Yqxa6tcjVnQ"
}})
});

await page.route('*/**/api/franchise/3', async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({json: [
  {
    "id": 1,
    "name": "pizzaPocket",
    "admins": [
      {
        "id": 3,
        "name": "pizza franchisee",
        "email": "f@jwt.com"
      }
    ],
    "stores": [
      {
        "id": 1,
        "name": "SLC",
        "totalRevenue": 0
      }
    ]
  }
]})
});
await page.route('*/**/api/user/me', async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({json: {
  "id": 3,
  "name": "pizza franchisee",
  "email": "f@jwt.com",
  "roles": [
    {
      "role": "diner"
    },
    {
      "objectId": 1,
      "role": "franchisee"
    }
  ],
  "iat": 1760453584
}})
});
}
test('login Franchise User', async ({ page }) => {
    await franchiseInit(page);
    await page.goto('/');
    await page.getByRole('link', { name: 'Login' }).click();
    
   
    await page.getByRole('textbox', { name: 'Email address' }).fill('f@jwt.com');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('franchisee');
    await page.getByRole('textbox', { name: 'Password' }).press('Enter');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await page.goto('/franchise-dashboard')
    await page.waitForTimeout(1000);
    await expect(page.getByText('Everything you need to run an')).toBeVisible();
    await expect(page.getByText('pizzaPocket')).toBeVisible();
    await page.getByRole('link', { name: 'Logout' }).click();
    
});



