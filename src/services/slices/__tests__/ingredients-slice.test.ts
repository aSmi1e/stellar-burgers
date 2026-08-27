import reducer, { fetchIngredients } from '../ingredients-slice';
import { TIngredient } from '@utils-types';

describe('редьюсер слайса ingredients', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
    }
  ];

  test('вызов с неизвестным экшеном и initial state === undefined возвращает initialState', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('fetchIngredients.pending включает загрузку и сбрасывает ошибку', () => {
    const stateBefore = {
      ingredients: [],
      isLoading: false,
      error: 'предыдущая ошибка'
    };

    const state = reducer(stateBefore, fetchIngredients.pending('', undefined));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchIngredients.fulfilled сохраняет полученные ингредиенты и выключает загрузку', () => {
    const stateBefore = {
      ingredients: [],
      isLoading: true,
      error: null
    };

    const state = reducer(
      stateBefore,
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('fetchIngredients.rejected сохраняет текст ошибки и выключает загрузку', () => {
    const stateBefore = {
      ingredients: [],
      isLoading: true,
      error: null
    };

    const state = reducer(
      stateBefore,
      fetchIngredients.rejected(
        new Error('Не удалось загрузить ингредиенты'),
        '',
        undefined
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});
