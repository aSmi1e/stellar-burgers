import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { fetchFeeds } from './feed-slice';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
  orderByNumber: TOrder | null;
};

const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderError: null,
  orderByNumber: null
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'order/createOrder',
  async (ingredientIds, { dispatch }) => {
    const response = await orderBurgerApi(ingredientIds);
    // Не дожидаясь ближайшего опроса ленты, сразу подтягиваем свежие данные —
    // так новый заказ появляется в /feed без задержки.
    dispatch(fetchFeeds());
    // response.order не содержит ingredients (в отличие от TOrder из фида/истории) —
    // добираем их из того, что сами же отправили, чтобы форма данных была единой.
    return { ...response.order, ingredients: ingredientIds };
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.orderRequest = false;
      state.orderError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.orderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message ?? 'Не удалось оформить заказ';
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumber = action.payload;
      });
  }
});

export const { closeOrderModal } = orderSlice.actions;
export default orderSlice.reducer;
