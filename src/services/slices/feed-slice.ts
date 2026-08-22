import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';

export type TFeedMessage = {
  success: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
};

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: true,
  error: null
};

// Кнопка «Обновить» — обычный одноразовый REST-запрос,
// а не переподключение сокета (сокет и так обновляется в реальном времени).
export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () =>
  getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    // connect/disconnect ничего не меняют в состоянии сами по себе — это лишь
    // сигналы для socket-middleware: "открой соединение по этому url" / "закрой".
    wsFeedConnect: (state, action: PayloadAction<string>) => {},
    wsFeedDisconnect: () => {},
    wsFeedConnecting: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    wsFeedOpen: (state) => {
      state.isLoading = false;
    },
    wsFeedMessage: (state, action: PayloadAction<TFeedMessage>) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.isLoading = false;
    },
    wsFeedError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFeeds.fulfilled, (state, action) => {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    });
  }
});

export const {
  wsFeedConnect,
  wsFeedDisconnect,
  wsFeedConnecting,
  wsFeedOpen,
  wsFeedMessage,
  wsFeedError
} = feedSlice.actions;

export default feedSlice.reducer;
