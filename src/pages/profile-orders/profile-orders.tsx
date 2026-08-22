import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '@slices';
import { selectProfileOrders, selectProfileOrdersLoading } from '@selectors';

const POLLING_INTERVAL = 3000;

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);
  const isLoading = useSelector(selectProfileOrdersLoading);

  useEffect(() => {
    dispatch(fetchOrders());

    const intervalId = setInterval(() => {
      dispatch(fetchOrders());
    }, POLLING_INTERVAL);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
