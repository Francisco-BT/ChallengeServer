import axios from 'axios';
import { useEffect, useState } from 'react';

const CancelToken = axios.CancelToken;
export function usePaginationRequest(requestFn, page, limit) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const source = CancelToken.source();
    const request = async () => {
      try {
        setLoading(true);
        const { data } = await requestFn({
          cancelToken: source.token,
          params: { page, limit },
        });
        setItems(data.items);
        setPagination(data.pagination);
      } catch (error) {
        let logOut = false;
        if (error.response && error.response.status === 401) {
          logOut = true;
        }

        setError({
          message: error.message,
          logOut,
        });
      } finally {
        setLoading(false);
      }
    };
    request();

    return () => {
      source.cancel();
    };
  }, [page, limit, requestFn]);

  return {
    items,
    pagination,
    error,
    loading,
  };
}
