//для генерации HAR
const fs = require('fs');
const path = require('path');

const API_URL = 'https://norma.education-services.ru/api';

const ingredient = (overrides) => ({
  _id: '000000000000000000000001',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0,
  ...overrides
});

const ingredients = [
  ingredient({}),
  ingredient({
    _id: '000000000000000000000002',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }),
  ingredient({
    _id: '000000000000000000000003',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  })
];

const entry = (method, url, status, body) => ({
  startedDateTime: '2026-01-01T00:00:00.000Z',
  time: 0,
  request: {
    method,
    url,
    httpVersion: 'HTTP/1.1',
    cookies: [],
    headers: [],
    queryString: [],
    headersSize: -1,
    bodySize: 0
  },
  response: {
    status,
    statusText: 'OK',
    httpVersion: 'HTTP/1.1',
    cookies: [],
    headers: [{ name: 'content-type', value: 'application/json' }],
    content: {
      size: 0,
      mimeType: 'application/json',
      text: JSON.stringify(body)
    },
    redirectURL: '',
    headersSize: -1,
    bodySize: -1
  },
  cache: {},
  timings: { send: 0, wait: 0, receive: 0 }
});

const buildHar = (entries) => ({
  log: {
    version: '1.2',
    creator: { name: 'stellar-burgers-tests', version: '1.0' },
    entries
  }
});

const ingredientsEntry = entry('GET', `${API_URL}/ingredients`, 200, {
  success: true,
  data: ingredients
});

const userEntry = entry('GET', `${API_URL}/auth/user`, 200, {
  success: true,
  user: { email: 'test@example.com', name: 'Test User' }
});

const orderEntry = entry('POST', `${API_URL}/orders`, 200, {
  success: true,
  name: 'Краторная булка N-200i',
  order: {
    _id: '000000000000000000000099',
    status: 'done',
    name: 'Краторная булка N-200i',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['000000000000000000000001']
  }
});

const feedsEntry = entry('GET', `${API_URL}/orders/all`, 200, {
  success: true,
  orders: [],
  total: 0,
  totalToday: 0
});

fs.writeFileSync(
  path.join(__dirname, 'ingredients.har'),
  JSON.stringify(buildHar([ingredientsEntry]), null, 2)
);

fs.writeFileSync(
  path.join(__dirname, 'order.har'),
  JSON.stringify(
    buildHar([ingredientsEntry, userEntry, orderEntry, feedsEntry]),
    null,
    2
  )
);

console.log('HAR-файлы сгенерированы: ingredients.har, order.har');
