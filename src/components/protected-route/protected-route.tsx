import { FC, ReactElement } from 'react';

type TProtectedRouteProps = {
  /** true — маршрут только для НЕавторизованных (login, register и т.д.) */
  onlyUnAuth?: boolean;
  children: ReactElement;
};

/**
 * TODO (шаг 2, авторизация):
 * 1. Дождаться проверки токена (isAuthChecked из стора), пока идёт — <Preloader />.
 * 2. Взять isAuthenticated из стора через useSelector.
 * 3. Если маршрут для авторизованных (onlyUnAuth === false) и пользователь
 *    НЕ авторизован — <Navigate to='/login' state={{ from: location }} replace />.
 * 4. Если маршрут только для НЕавторизованных (onlyUnAuth === true) и пользователь
 *    авторизован — <Navigate to={location.state?.from || '/'} replace />.
 */
export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => children;
