import { test, expect } from 'playwright-test-coverage';
import { User, Role } from '../src/service/pizzaService';
import { Page } from '@playwright/test';
async function basicInit(page: Page) {
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = { 'd@jwt.com': { id: '3', name: 'Kai Chen', email: 'd@jwt.com', password: 'a', roles: [{ role: Role.Diner }] } };

  // Authorize login for the given user
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = route.request().postDataJSON();
    const user = validUsers[loginReq.email];
    if (!user || user.password !== loginReq.password) {
      await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
      return;
    }
    loggedInUser = validUsers[loginReq.email];
    const loginRes = {
      user: loggedInUser,
      token: 'abcdef',
    };
    expect(route.request().method()).toBe('PUT');
    await route.fulfill({ json: loginRes });
  });
  
  

  // Return the currently logged in user
  await page.route('*/**/api/user/me', async (route) => {
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: loggedInUser });
  });

  // A standard menu
  await page.route('*/**/api/order/menu', async (route) => {
    const menuRes = [
      {
        id: 1,
        title: 'Veggie',
        image: 'pizza1.png',
        price: 0.0038,
        description: 'A garden of delight',
      },
      {
        id: 2,
        title: 'Pepperoni',
        image: 'pizza2.png',
        price: 0.0042,
        description: 'Spicy treat',
      },
    ];
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: menuRes });
  });

  // Standard franchises and stores
  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    const franchiseRes = {
      franchises: [
        {
          id: 2,
          name: 'LotaPizza',
          stores: [
            { id: 4, name: 'Lehi' },
            { id: 5, name: 'Springville' },
            { id: 6, name: 'American Fork' },
          ],
        },
        { id: 3, name: 'PizzaCorp', stores: [{ id: 7, name: 'Spanish Fork' }] },
        { id: 4, name: 'topSpot', stores: [] },
      ],
    };
    expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: franchiseRes });
  });

  // Order a pizza.
  await page.route('*/**/api/order', async (route) => {
    const orderReq = route.request().postDataJSON();
    const orderRes = {
      order: { ...orderReq, id: 23 },
      jwt: 'eyJpYXQ',
    };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: orderRes });
  });

  await page.goto('/');
}

test('login', async ({ page }) => {
  await basicInit(page);
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('d@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page.getByRole('link', { name: 'KC' })).toBeVisible();
});

test('purchase with login', async ({ page }) => {
  await basicInit(page);

  // Go to order page
  await page.getByRole('button', { name: 'Order now' }).click();

  // Create order
  await expect(page.locator('h2')).toContainText('Awesome is a click away');
  await page.getByRole('combobox').selectOption('4');
  await page.getByRole('link', { name: 'Image Description Veggie A' }).click();
  await page.getByRole('link', { name: 'Image Description Pepperoni' }).click();
  await expect(page.locator('form')).toContainText('Selected pizzas: 2');
  await page.getByRole('button', { name: 'Checkout' }).click();

  // Login
  await page.getByPlaceholder('Email address').click();
  await page.getByPlaceholder('Email address').fill('d@jwt.com');
  await page.getByPlaceholder('Email address').press('Tab');
  await page.getByPlaceholder('Password').fill('a');
  await page.getByRole('button', { name: 'Login' }).click();

  // Pay
  await expect(page.getByRole('main')).toContainText('Send me those 2 pizzas right now!');
  await expect(page.locator('tbody')).toContainText('Veggie');
  await expect(page.locator('tbody')).toContainText('Pepperoni');
  await expect(page.locator('tfoot')).toContainText('0.008 ₿');
  await page.getByRole('button', { name: 'Pay now' }).click();

  // Check balance
  await expect(page.getByText('0.008')).toBeVisible();
});

test('home page', async ({ page }) => {
  await page.goto('/');

  expect(await page.title()).toBe('JWT Pizza');
});
test('About, History, Docs, Not Found and Not Logged in Franchise', async ({ page }) => {
  await page.goto('/');
  await page.getByText('JWT Pizza', { exact: true }).click();
  await page.getByRole('contentinfo').getByRole('link', { name: 'Franchise' }).click();
  await expect(page.getByRole('main')).toContainText('So you want a piece of the pie?');
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page.getByRole('main')).toContainText('The secret sauce');
  await page.getByRole('link', { name: 'History' }).click();
  await expect(page.getByRole('heading')).toContainText('Mama Rucci, my my');
  await page.goto('/docs');
  await expect(page.getByRole('main')).toContainText('JWT Pizza API');
  await page.goto('/testing');
  await expect(page.getByRole('heading')).toContainText('Oops');
});
test('register', async ({ page }) => {
  await page.route('*/**/api/auth', async (route) => {
    const registerReq = route.request().postDataJSON();
    expect(registerReq.name).toBe('test');
    const registerRes = {  
          "user": {
            "name": "test",
            "email": "test@jwt.com",
            "roles": [
              {
                "role": "diner"
              }
            ],
            "id": 5
          },
          "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImVtYWlsIjoidGVzdEBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJkaW5lciJ9XSwiaWQiOjUsImlhdCI6MTc1OTg2ODIwN30.gh4JmIcrIQHROUZgGxTvva-srZac2m0MzJsfR1721nI"
            };
    expect(route.request().method()).toBe('POST');
    await route.fulfill({ json: registerRes });
  });
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).click();
  await page.getByRole('textbox', { name: 'Full name' }).fill('test');
  await page.getByRole('textbox', { name: 'Email address' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('test@jwt.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('test');
  await page.getByRole('button', { name: 'Register' }).click();
  await page.getByRole('link', { name: 't', exact: true }).click();
    await expect(page.getByRole('main')).toContainText('test');
  await expect(page.getByRole('main')).toContainText('test@jwt.com');
  await page.route('*/**/api/auth', async (route) => {
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: {
  "message": "logout successful"
} });
  });
  await expect(page.getByRole('main')).toContainText('diner');
  await page.getByRole('link', { name: 'Logout' }).click();
  await expect(page.locator('#navbar-dark')).toContainText('Register');
});



async function adminInit(page:Page){
  await page.route('*/**/api/auth', async (route) => {
    const loginReq = route.request().postDataJSON();
    expect(loginReq.email).toEqual("a@jwt.com");
    expect(route.request().method()).toBe('PUT');
    await route.fulfill({ json: {
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IuW4uOeUqOWQjeWtlyIsImVtYWlsIjoiYUBqd3QuY29tIiwicm9sZXMiOlt7InJvbGUiOiJhZG1pbiJ9XSwiaWF0IjoxNzU5ODcyNTU1fQ.FlCk7d2OYmlZFyiNKgyjdCLD5pqwnqPF80mAQmaGXO4"
}

 });
  });


  await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
  expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: {
  "franchises": [
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
  ],
  "more": false
}



 });
 
  });

  await page.route('*/**/api/franchise?page=0&limit=10&name=**', async (route) => {
  expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: {
  "franchises": [
    {
      "id": 10,
      "name": "test",
      "admins": [
        {
          "id": 4,
          "name": "test",
          "email": "test@jwt.com"
        }
      ],
      "stores": []
    }
  ],
  "more": false
}




 });
 
  });
  await page.route('*/**/api/franchise', async (route) => {
  expect(route.request().method()).toBe('POST');
  const createReq = route.request().postDataJSON();
  expect(createReq.name).toEqual("test");
  await route.fulfill({ json: {
  "stores": [],
  "id": 10,
  "name": "test",
  "admins": [
    {
      "email": "test@jwt.com",
      "id": 4,
      "name": "test"
    }
  ]
}


 });
  
});
}
async function addFranchise(page:Page){
  await page.route('*/**/api/franchise?page=0&limit=3&name=*', async (route) => {
  expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: {
  "franchises": [
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
    },
    {
      "id": 10,
      "name": "test",
      "admins": [
        {
          "id": 4,
          "name": "test",
          "email": "test@jwt.com"
        }
      ],
      "stores": []
    }
  ],
  "more": false
}




 });
 
  });
  
  await page.route('*/**/api/auth', async (route) => {
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: {
  "message": "logout successful"
} });
  });

}

async function removeFranchise(page:Page){
  await page.route('*/**/api/franchise?page=0&limit=10&name=**', async (route) => {
  expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: {
  "franchises": [
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
    },
    {
      "id": 10,
      "name": "test",
      "admins": [
        {
          "id": 4,
          "name": "test",
          "email": "test@jwt.com"
        }
      ],
      "stores": []
    }
  ],
  "more": false
}




 });
 
  });
  await page.route(/.+\/api\/franchise\/\d+$/, async (route) => {
    expect(route.request().method()).toBe('DELETE');
    await route.fulfill({ json: {
  "message": "franchise deleted - test"
} });
  });
}

async function repopulate(page:Page){
  //console.log('test')
  await page.route(/\/api\/franchise\?page=0&limit=3&name=.*/, async (route) => {
  expect(route.request().method()).toBe('GET');
    await route.fulfill({ json: {
  "franchises": [
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
  ],
  "more": false
}



 });
 
  });

}
test('admin', async ({ page }) => {
  await adminInit(page);
  await page.goto('http://localhost:5173/');
  await page.getByRole('link', { name: 'Login' }).click();
  await page.getByRole('textbox', { name: 'Email address' }).fill('a@jwt.com');
  await page.getByRole('textbox', { name: 'Email address' }).press('Tab');
  await page.getByRole('textbox', { name: 'Password' }).fill('admin');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('#navbar-dark')).toContainText('Admin');
  await page.getByRole('link', { name: 'Admin' }).click();
  
  await expect(page.locator('h2')).toContainText('Mama Ricci\'s kitchen');
  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await expect(page.getByRole('heading')).toContainText('Create franchise');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.locator('h2')).toContainText('Mama Ricci\'s kitchen');
  await addFranchise(page);

  await page.getByRole('button', { name: 'Add Franchise' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).click();
  await page.getByRole('textbox', { name: 'franchise name' }).fill('test');
  await page.getByRole('textbox', { name: 'franchisee admin email' }).click();
  await page.getByRole('textbox', { name: 'franchisee admin email' }).fill('test@jwt.com');
  await page.getByRole('button', { name: 'Create' }).click();

  await expect(page.getByRole('main')).toContainText('test');
  await page.getByRole('textbox', { name: 'Filter franchises' }).click();
  await page.getByRole('textbox', { name: 'Filter franchises' }).fill('test');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.getByRole('main')).toContainText('test');

  await removeFranchise(page);
  await page.getByRole('textbox', { name: 'Filter franchises' }).fill('');
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('h2')).toContainText('Mama Ricci\'s kitchen');
  await repopulate(page);
  await page.getByRole('row', { name: 'test test Close' }).getByRole('button').click();
  await expect(page.getByRole('heading')).toContainText('Sorry to see you go');
  await page.getByRole('button', { name: 'Close' }).click();
  await expect(page.getByRole('main')).not.toContainText('test');
  await page.getByRole('link', { name: 'Logout' }).click();
});