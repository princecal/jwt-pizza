import { test, expect } from 'playwright-test-coverage';
import { Page } from '@playwright/test';
async function init(page: Page) {
    await page.route('*/**/api/auth', async (route) => {
        expect(route.request().method()).toBe('PUT');
        await route.fulfill({
            json: {
                "user": {
                    "id": 1,
                    "name": "常用名字",
                    "email": "a@jwt.com",
                    "roles": [
                        {
                            "role": "admin"
                        }
                    ]
                },
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzYwNDc3NDkyfQ._Q8eiA4ZnuPz-VorGMCGQS3G-RxyJOUV9jqDnWPd-rs"
            }
        });
    });
    await page.route('*/**/api/franchise?page=0&limit=10&name=*', async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({
            json: {
                "franchises": [
                    {
                        "id": 56,
                        "name": "01shlw3m5t",
                        "admins": [
                            {
                                "id": 123,
                                "name": "pizza franchisee",
                                "email": "scmb2twsq@test.com"
                            }
                        ],
                        "stores": [
                            {
                                "id": 28,
                                "name": "q3ynh1he6t",
                                "totalRevenue": 0
                            }
                        ]
                    },
                    {
                        "id": 104,
                        "name": "03q9j765xu",
                        "admins": [
                            {
                                "id": 233,
                                "name": "pizza franchisee",
                                "email": "uyl4yixgyz@test.com"
                            }
                        ],
                        "stores": [
                            {
                                "id": 52,
                                "name": "61hdd8mv60",
                                "totalRevenue": 0
                            }
                        ]
                    },
                    {
                        "id": 91,
                        "name": "0dnivyaqc4",
                        "admins": [
                            {
                                "id": 208,
                                "name": "pizza franchisee",
                                "email": "cezh8xt991@test.com"
                            }
                        ],
                        "stores": []
                    }
                ],
                "more": true
            }
        })
    })
    await page.route('*/**/api/user?page=0&limit=10&name=*', async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({
            json: {
                "users": [
                    {
                        "id": 1,
                        "name": "常用名字",
                        "email": "a@jwt.com",
                        "roles": [
                            {
                                "role": "admin"
                            }
                        ]
                    },
                    {
                        "id": 2,
                        "name": "pizza diner",
                        "email": "d@jwt.com",
                        "roles": [
                            {
                                "role": "diner"
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "name": "pizza franchisee",
                        "email": "f@jwt.com",
                        "roles": [
                            {
                                "role": "diner"
                            },
                            {
                                "role": "franchisee"
                            }
                        ]
                    },
                    {
                        "id": 4,
                        "name": "pizza diner",
                        "email": "yuzk36e1x3@test.com",
                        "roles": [
                            {
                                "role": "diner"
                            }
                        ]
                    },
                    {
                        "id": 5,
                        "name": "wmdjcgwe89",
                        "email": "nngejgweer@test.com",
                        "roles": [
                            {
                                "role": "diner"
                            }
                        ]
                    },
                    {
                        "id": 6,
                        "name": "pizza franchisee",
                        "email": "twul6ex2u4@test.com",
                        "roles": [
                            {
                                "role": "diner"
                            },
                            {
                                "role": "franchisee"
                            },
                            {
                                "role": "franchisee"
                            },
                            {
                                "role": "franchisee"
                            }
                        ]
                    },
                    {
                        "id": 7,
                        "name": "pizza diner",
                        "email": "c47uv6csjn@test.com",
                        "roles": [
                            {
                                "role": "diner"
                            }
                        ]
                    },
                    {
                        "id": 8,
                        "name": "test",
                        "email": "test@jwt.com",
                        "roles": [
                            {
                                "role": "diner"
                            }
                        ]
                    },
                    {
                        "id": 9,
                        "name": "59lan21fy",
                        "email": "59lan21fy@admin.com",
                        "roles": [
                            {
                                "role": "admin"
                            }
                        ]
                    },
                    {
                        "id": 10,
                        "name": "fcmhzr0pw4",
                        "email": "fcmhzr0pw4@admin.com",
                        "roles": [
                            {
                                "role": "admin"
                            }
                        ]
                    }
                ],
                "more": true
            }
        })
    })
}
async function search(page: Page) {
    await page.route('*/**/api/user?page=0&limit=10&name=*pizza*', async (route) => {
        expect(route.request().method()).toBe('GET');
        await route.fulfill({
            json: {
                "users": [
                    {
                        "id": 2,
                        "name": "pizza diner",
                        "email": "d@jwt.com",
                        "roles": [
                            {
                                "role": "diner"
                            }
                        ]
                    },
                    {
                        "id": 3,
                        "name": "pizza franchisee",
                        "email": "f@jwt.com",
                        "roles": [
                            {
                                "role": "diner"
                            },
                            {
                                "role": "franchisee"
                            }
                        ]
                    },
                    {
                        "id": 4,
                        "name": "pizza diner",
                        "email": "yuzk36e1x3@test.com",
                        "roles": [
                            {
                                "role": "diner"
                            }
                        ]
                    },
                    {
                        "id": 6,
                        "name": "pizza franchisee",
                        "email": "twul6ex2u4@test.com",
                        "roles": [
                            {
                                "role": "diner"
                            },
                            {
                                "role": "franchisee"
                            },
                            {
                                "role": "franchisee"
                            },
                            {
                                "role": "franchisee"
                            }
                        ]
                    },
                    {
                        "id": 7,
                        "name": "pizza diner",
                        "email": "c47uv6csjn@test.com",
                        "roles": [
                            {
                                "role": "diner"
                            }
                        ]
                    },
                    {
                        "id": 15,
                        "name": "pizza diner",
                        "email": "syq9j4qu2w@test.com",
                        "roles": [
                            {
                                "role": "diner"
                            }
                        ]
                    },
                    {
                        "id": 16,
                        "name": "pizza franchisee",
                        "email": "9ade0l0101@test.com",
                        "roles": [
                            {
                                "role": "diner"
                            },
                            {
                                "role": "franchisee"
                            },
                            {
                                "role": "franchisee"
                            },
                            {
                                "role": "franchisee"
                            }
                        ]
                    },
                    {
                        "id": 24,
                        "name": "pizza diner",
                        "email": "7ef0qfy47i@test.com",
                        "roles": [
                            {
                                "role": "diner"
                            }
                        ]
                    },
                    {
                        "id": 25,
                        "name": "pizza franchisee",
                        "email": "nb79njy84c@test.com",
                        "roles": [
                            {
                                "role": "diner"
                            },
                            {
                                "role": "franchisee"
                            },
                            {
                                "role": "franchisee"
                            },
                            {
                                "role": "franchisee"
                            }
                        ]
                    },
                    {
                        "id": 33,
                        "name": "pizza franchisee",
                        "email": "9ti4woikud@test.com",
                        "roles": [
                            {
                                "role": "diner"
                            },
                            {
                                "role": "franchisee"
                            },
                            {
                                "role": "franchisee"
                            },
                            {
                                "role": "franchisee"
                            }
                        ]
                    }
                ],
                "more": true
            }
        })
    })
}
test('userList', async ({ page }) => {
    await page.goto('/');
    await init(page);
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
    await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('admin');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page.getByText('UsersUser NameUser EmailUser')).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).first().click();
    await expect(page.getByText('Bidding someone farewell')).toBeVisible();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Filter users' }).click();
    await page.getByRole('textbox', { name: 'Filter users' }).fill('pizza');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByRole('button', { name: 'Delete' }).first()).toBeVisible();
});