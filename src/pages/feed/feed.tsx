import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds, wsFeedConnect, wsFeedDisconnect } from '@slices';
import { selectFeedOrders, selectFeedLoading } from '@selectors';
import { WS_URL } from '../../utils/ws-url';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);

  useEffect(() => {
    dispatch(wsFeedConnect(`${WS_URL}/orders/all`));
    return () => {
      dispatch(wsFeedDisconnect());
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
