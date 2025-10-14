import { test, expect } from 'playwright-test-coverage';
import { Page } from '@playwright/test';

async function userInit(page:Page){
    await page.route('*/**/api/auth', async (route) => {
        expect(route.request().method()).toBe('POST');
        await route.fulfill({ json: {
            "user": {
                "name": "pizza diner",
                "email": "user6481@jwt.com",
                "roles": [
                {
                    "role": "diner"
                }
                ],
                "id": 85
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicGl6emEgZGluZXIiLCJlbWFpbCI6InVzZXI2NDgxQGp3dC5jb20iLCJyb2xlcyI6W3sicm9sZSI6ImRpbmVyIn1dLCJpZCI6ODUsImlhdCI6MTc2MDQ2NTAyNH0.54PmAhHTUq7m3IPuFkgz1usyHYFIx-MpVjBJ5CPJPYg"
            } });
            });
    await page.route('*/**/api/order', async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({ json: {
            "dinerId": 85,
            "orders": [],
            "page": 1
            } });
    });
    await page.route('*/**/api/user/85', async (route) => {
        expect(route.request().method()).toBe('PUT');
        await route.fulfill({ json: {
            "user": {
                "id": 85,
                "name": "pizza diner",
                "email": "user6481@jwt.com",
                "roles": [
                {
                    "role": "diner"
                }
                ]
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsIm5hbWUiOiJwaXp6YSBkaW5lciIsImVtYWlsIjoidXNlcjY0ODFAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifV0sImlhdCI6MTc2MDQ2NTAyNH0.XACxD0ox_RVzx8zOfCGJl3dg6K-RMNnVgC6uP-x4eF0"
            } });
    });
}

async function userLogout(page:Page){
    await page.route('*/**/api/auth', async (route) => {
        expect(route.request().method()).toBe('DELETE');
        await route.fulfill({ json: {
            "message": "logout successful"
            } });
            });
}
async function userUpdate(page:Page){
    await page.route('*/**/api/user/85', async (route) => {
        expect(route.request().method()).toBe('PUT');
        await route.fulfill({ json: {
            "user": {
                "id": 85,
                "name": "pizza dinerx",
                "email": "user6481@jwt.com",
                "roles": [
                {
                    "role": "diner"
                }
                ]
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ODUsIm5hbWUiOiJwaXp6YSBkaW5lciIsImVtYWlsIjoidXNlcjY0ODFAand0LmNvbSIsInJvbGVzIjpbeyJyb2xlIjoiZGluZXIifV0sImlhdCI6MTc2MDQ2NTAyNH0.XACxD0ox_RVzx8zOfCGJl3dg6K-RMNnVgC6uP-x4eF0"
            } });
    });
    await page.route('*/**/api/auth', async (route) => {
        expect(route.request().method()).toBe('PUT');
        await route.fulfill({ json: {
            "user": {
                "name": "pizza dinerx",
                "email": "user6481@jwt.com",
                "roles": [
                {
                    "role": "diner"
                }
                ],
                "id": 85
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicGl6emEgZGluZXIiLCJlbWFpbCI6InVzZXI2NDgxQGp3dC5jb20iLCJyb2xlcyI6W3sicm9sZSI6ImRpbmVyIn1dLCJpZCI6ODUsImlhdCI6MTc2MDQ2NTAyNH0.54PmAhHTUq7m3IPuFkgz1usyHYFIx-MpVjBJ5CPJPYg"
            } });
            });

}
test('updateUser', async ({ page }) => {
    const email = `user${Math.floor(Math.random() * 10000)}@jwt.com`;
    await userInit(page);
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
    await userUpdate(page);
    await page.getByRole('button', { name: 'Update' }).click();

    await page.waitForSelector('[role="dialog"].hidden', { state: 'attached' });

    await expect(page.getByRole('main')).toContainText('pizza dinerx');
    await userLogout(page);
    await page.getByRole('link', { name: 'Logout' }).click();
    await userUpdate(page);
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
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByLabel('Global').getByRole('link', { name: 'Franchise' })).toBeVisible();
    await page.getByLabel('Global').getByRole('link', { name: 'Franchise' }).click();
    await page.goto('/franchise-dashboard')
    await page.waitForTimeout(1000);
    await expect(page.getByText('Everything you need to run an')).toBeVisible();
    await expect(page.getByText('pizzaPocket')).toBeVisible();
    await page.route('*/**/api/auth', async (route) => {
        expect(route.request().method()).toBe('DELETE');
        await route.fulfill({ json: {
            "message": "logout successful"
            } });
            });
    await page.getByRole('link', { name: 'Logout' }).click();
    
});



