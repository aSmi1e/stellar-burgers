import { RootState } from '../store';

export const selectUser = (state: RootState) => state.auth.user;

export const selectIsAuthChecked = (state: RootState) =>
  state.auth.isAuthChecked;

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;

export const selectLoginError = (state: RootState) => state.auth.loginError;

export const selectRegisterError = (state: RootState) =>
  state.auth.registerError;

export const selectUpdateUserError = (state: RootState) =>
  state.auth.updateUserError;
