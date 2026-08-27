import { test, expect } from '@playwright/test';
import path from 'path';

const BUN_NAME = 'Краторная булка N-200i';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';

test.describe('Конструктор бургера: добавление ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(path.join(__dirname, 'hars/ingredients.har'), {
      url: '**/api/**'
    });

    await page.goto('/');
    await expect(page.getByText(BUN_NAME)).toBeVisible();
  });

  test('добавление булки в конструктор', async ({ page }) => {
    await page
      .locator('li', { hasText: BUN_NAME })
      .getByText('Добавить')
      .click();

    const constructor = page.locator('section');
    // булка после добавления одновременно отображается сверху и снизу
    await expect(constructor.getByText(BUN_NAME)).toHaveCount(2);
    await expect(page.getByText('Выберите булки')).toHaveCount(0);
  });

  test('добавление начинки в конструктор', async ({ page }) => {
    await page
      .locator('li', { hasText: MAIN_NAME })
      .getByText('Добавить')
      .click();

    const constructor = page.locator('section');
    await expect(constructor.getByText(MAIN_NAME)).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toHaveCount(0);
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(path.join(__dirname, 'hars/ingredients.har'), {
      url: '**/api/**'
    });

    await page.goto('/');
    await expect(page.getByText(BUN_NAME)).toBeVisible();
  });

  test('открытие модального окна показывает данные того ингредиента, по которому кликнули', async ({
    page
  }) => {
    await page.getByText(MAIN_NAME).click();

    const modal = page.locator('#modals');
    await expect(modal.getByText(MAIN_NAME)).toBeVisible();
    // убеждаемся, что открылась карточка не первого попавшегося, а нужного ингредиента
    await expect(modal.getByText('4242')).toBeVisible();
  });

  test('закрытие модального окна по клику на крестик', async ({ page }) => {
    await page.getByText(BUN_NAME).click();

    const modal = page.locator('#modals');
    await expect(modal.getByText(BUN_NAME)).toBeVisible();

    await page.locator('#modals button').click();

    await expect(modal.getByText(BUN_NAME)).toHaveCount(0);
  });

  test('закрытие модального окна по клику на оверлей', async ({ page }) => {
    await page.getByText(BUN_NAME).click();

    const modal = page.locator('#modals');
    await expect(modal.getByText(BUN_NAME)).toBeVisible();

    // второй оверлей, элемент внутри портала modals, кликаем в его угол, чтобы не задеть окно
    await page
      .locator('#modals > div')
      .nth(1)
      .click({ position: { x: 5, y: 5 } });

    await expect(modal.getByText(BUN_NAME)).toHaveCount(0);
  });
});

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.routeFromHAR(path.join(__dirname, 'hars/order.har'), {
      url: '**/api/**'
    });

    // подставляем фейковые токены авторизации до того, как страница успеет что-либо запросить с их использованием.
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer fake-access-token',
        url: 'http://localhost:4000'
      }
    ]);
    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
    });

    await page.goto('/');
    await expect(page.getByText(BUN_NAME)).toBeVisible();
  });

  test('создание заказа: модалка с верным номером и очистка конструктора', async ({
    page
  }) => {
    await page
      .locator('li', { hasText: BUN_NAME })
      .getByText('Добавить')
      .click();
    await page
      .locator('li', { hasText: MAIN_NAME })
      .getByText('Добавить')
      .click();

    await page.getByText('Оформить заказ').click();

    const modal = page.locator('#modals');

    await expect(modal.getByText('12345')).toBeVisible();

    await page.locator('#modals button').click();
    await expect(modal.getByText('12345')).toHaveCount(0);

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();
  });
});
