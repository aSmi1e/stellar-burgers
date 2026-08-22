import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import {
  ingredientsReducer,
  burgerConstructorReducer,
  authReducer,
  feedReducer,
  profileOrdersReducer,
  orderReducer,
  wsFeedConnect,
  wsFeedDisconnect,
  wsFeedConnecting,
  wsFeedOpen,
  wsFeedMessage,
  wsFeedError,
  wsProfileOrdersConnect,
  wsProfileOrdersDisconnect,
  wsProfileOrdersConnecting,
  wsProfileOrdersOpen,
  wsProfileOrdersMessage,
  wsProfileOrdersError
} from './slices';
import { createSocketMiddleware } from './middleware/socket-middleware';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: burgerConstructorReducer,
  auth: authReducer,
  feed: feedReducer,
  profileOrders: profileOrdersReducer,
  order: orderReducer
});

// По одному мидлвару на каждый WebSocket-канал: публичная лента заказов
// и приватная история заказов пользователя — это разные соединения.
const feedSocketMiddleware = createSocketMiddleware({
  connect: wsFeedConnect,
  disconnect: wsFeedDisconnect,
  onConnecting: wsFeedConnecting,
  onOpen: wsFeedOpen,
  onMessage: wsFeedMessage,
  onError: wsFeedError
});

const profileOrdersSocketMiddleware = createSocketMiddleware({
  connect: wsProfileOrdersConnect,
  disconnect: wsProfileOrdersDisconnect,
  onConnecting: wsProfileOrdersConnecting,
  onOpen: wsProfileOrdersOpen,
  onMessage: wsProfileOrdersMessage,
  onError: wsProfileOrdersError
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      feedSocketMiddleware,
      profileOrdersSocketMiddleware
    ),
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
