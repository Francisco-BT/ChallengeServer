import axios from 'axios';
import { useState, useEffect } from 'react';

import { api } from '../services';

const CancelToken = axios.CancelToken;
export function useAccounts(page, limit) {
  const [accounts, setAccounts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const source = CancelToken.source();
    const requestAccounts = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/api/v1/accounts', {
          cancelToken: source.token,
          params: { page, limit },
        });
        setAccounts(data.items);
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
    requestAccounts();
    return () => {
      source.cancel();
    };
  }, [page, limit]);

  return {
    accounts,
    pagination,
    loading,
    error,
  };
}
