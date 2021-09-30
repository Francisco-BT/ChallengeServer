import { useEffect, useState } from 'react';

import { api } from '../services';
import { useSessionExpired } from './useSessionExpired';
import { requestHandler } from '../utils';

export function usePaginationRequest(url, page, limit, fetch) {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const sessionExpired = useSessionExpired();

  useEffect(() => {
    const { request, cleanUp } = requestHandler({
      setLoading,
      setErrors,
      sessionExpired,
      apiCall: async (unmounted, cancelToken) => {
        const { data } = await api.get(url, {
          cancelToken,
          params: { page, limit },
        });
        if (!unmounted) {
          setItems(data.items ? data.items : data);
          setPagination(data.pagination ? data.pagination : null);
        }
      },
    });
    request();

    return cleanUp;
  }, [page, limit, url, fetch, sessionExpired]);

  return {
    items,
    pagination,
    errors,
    loading,
  };
}
