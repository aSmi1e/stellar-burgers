import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../burger-constructor-slice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('редьюсер слайса burgerConstructor', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const bun: TIngredient = {
    _id: 'bun-1',
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
  };

  const sauce: TIngredient = {
    _id: 'sauce-1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
  };

  const main: TIngredient = {
    _id: 'main-1',
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
  };

  test('вызов с неизвестным экшеном и initial state === undefined возвращает initialState', () => {
    const state = reducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('addIngredient с булкой записывает её в bun (а не в массив ingredients)', () => {
    const state = reducer(initialState, addIngredient(bun));

    expect(state.ingredients).toHaveLength(0);
    expect(state.bun).toEqual(expect.objectContaining(bun));
    // у элемента конструктора должен появиться собственный уникальный id,
    // отдельный от _id самого ингредиента
    expect(typeof state.bun?.id).toBe('string');
  });

  test('повторный addIngredient с другой булкой заменяет предыдущую', () => {
    const stateWithBun = reducer(initialState, addIngredient(bun));
    const anotherBun: TIngredient = {
      ...bun,
      _id: 'bun-2',
      name: 'Другая булка'
    };

    const state = reducer(stateWithBun, addIngredient(anotherBun));

    expect(state.bun).toEqual(expect.objectContaining(anotherBun));
  });

  test('addIngredient с начинкой/соусом добавляет элемент в конец массива ingredients', () => {
    const stateWithSauce = reducer(initialState, addIngredient(sauce));
    const state = reducer(stateWithSauce, addIngredient(main));

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]).toEqual(expect.objectContaining(sauce));
    expect(state.ingredients[1]).toEqual(expect.objectContaining(main));
  });

  test('removeIngredient удаляет элемент по его сгенерированному id', () => {
    const stateWithIngredients = reducer(initialState, addIngredient(sauce));
    const [addedSauce] = stateWithIngredients.ingredients;

    const state = reducer(
      stateWithIngredients,
      removeIngredient(addedSauce.id)
    );

    expect(state.ingredients).toHaveLength(0);
  });

  test('moveIngredient меняет местами два соседних элемента', () => {
    let state = reducer(initialState, addIngredient(sauce));
    state = reducer(state, addIngredient(main));

    const [first, second] = state.ingredients;

    state = reducer(state, moveIngredient({ index: 0, direction: 'down' }));

    expect(state.ingredients[0]).toEqual(second);
    expect(state.ingredients[1]).toEqual(first);
  });

  test('moveIngredient не выходит за границы массива', () => {
    const stateWithOneItem = reducer(initialState, addIngredient(sauce));

    const stateUp = reducer(
      stateWithOneItem,
      moveIngredient({ index: 0, direction: 'up' })
    );
    const stateDown = reducer(
      stateWithOneItem,
      moveIngredient({ index: 0, direction: 'down' })
    );

    expect(stateUp).toEqual(stateWithOneItem);
    expect(stateDown).toEqual(stateWithOneItem);
  });

  test('clearConstructor сбрасывает состояние конструктора', () => {
    let state = reducer(initialState, addIngredient(bun));
    state = reducer(state, addIngredient(sauce));

    state = reducer(state, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
