import { useEffect, useState } from 'react';
import axios from 'axios';

import { api } from '../services';

const CancelToken = axios.CancelToken;
export function usePaginationRequest(url, page, limit, fetch) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let unmounted = false;
    const source = CancelToken.source();
    const request = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(url, {
          cancelToken: source.token,
          params: { page, limit },
        });
        if (!unmounted) {
          setItems(data.items ? data.items : data);
          setPagination(data.pagination ? data.pagination : null);
        }
      } catch (error) {
        let logOut = false;
        if (error.response && error.response.status === 401) {
          logOut = true;
        }

        !unmounted &&
          setError({
            message: error.message,
            logOut,
          });
      } finally {
        !unmounted && setLoading(false);
      }
    };
    request();

    return () => {
      unmounted = true;
      source.cancel();
    };
  }, [page, limit, url, fetch]);

  return {
    items,
    pagination,
    error,
    loading,
  };
}
