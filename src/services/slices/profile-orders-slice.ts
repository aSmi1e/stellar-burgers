import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export type TProfileOrdersMessage = {
  success: boolean;
  orders: TOrder[];
};

type TProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  isLoading: true,
  error: null
};

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    wsProfileOrdersConnect: (state, action: PayloadAction<string>) => {},
    wsProfileOrdersDisconnect: () => {},
    wsProfileOrdersConnecting: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    wsProfileOrdersOpen: (state) => {
      state.isLoading = false;
    },
    wsProfileOrdersMessage: (
      state,
      action: PayloadAction<TProfileOrdersMessage>
    ) => {
      state.orders = action.payload.orders;
      state.isLoading = false;
    },
    wsProfileOrdersError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const {
  wsProfileOrdersConnect,
  wsProfileOrdersDisconnect,
  wsProfileOrdersConnecting,
  wsProfileOrdersOpen,
  wsProfileOrdersMessage,
  wsProfileOrdersError
} = profileOrdersSlice.actions;

export default profileOrdersSlice.reducer;
