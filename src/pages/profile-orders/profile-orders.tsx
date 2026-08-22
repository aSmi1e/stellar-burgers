import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { wsProfileOrdersConnect, wsProfileOrdersDisconnect } from '@slices';
import { selectProfileOrders } from '@selectors';
import { WS_URL } from '../../utils/ws-url';
import { getCookie } from '../../utils/cookie';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);

  useEffect(() => {
    const token = getCookie('accessToken')?.replace('Bearer ', '');
    dispatch(wsProfileOrdersConnect(`${WS_URL}/orders?token=${token}`));

    return () => {
      dispatch(wsProfileOrdersDisconnect());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
