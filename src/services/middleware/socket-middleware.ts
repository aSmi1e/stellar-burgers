import { Middleware } from 'redux';
import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload
} from '@reduxjs/toolkit';

// Набор экшенов, которые мидлвар дёргает в ответ на события сокета.
// connect/disconnect — «команды» (что сделать), остальные — «события» (что произошло).
export type TSocketActions<TMessage> = {
  connect: ActionCreatorWithPayload<string>;
  disconnect: ActionCreatorWithoutPayload;
  onConnecting: ActionCreatorWithoutPayload;
  onOpen: ActionCreatorWithoutPayload;
  onError: ActionCreatorWithPayload<string>;
  onMessage: ActionCreatorWithPayload<TMessage>;
};

export const createSocketMiddleware = <TMessage>(
  actions: TSocketActions<TMessage>
): Middleware => {
  let socket: WebSocket | null = null;

  return (store) => (next) => (action) => {
    const { dispatch } = store;

    if (actions.connect.match(action)) {
      socket = new WebSocket(action.payload);
      dispatch(actions.onConnecting());

      socket.onopen = () => {
        dispatch(actions.onOpen());
      };

      socket.onerror = () => {
        dispatch(actions.onError('Ошибка соединения с сервером'));
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.success === false) {
          dispatch(actions.onError(data.message || 'Ошибка соединения'));
          return;
        }
        dispatch(actions.onMessage(data));
      };

      socket.onclose = () => {
        socket = null;
      };
    }

    if (actions.disconnect.match(action)) {
      socket?.close();
      socket = null;
    }

    next(action);
  };
};
