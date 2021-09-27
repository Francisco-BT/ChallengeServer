import axios from 'axios';
import { useEffect, useState } from 'react';

import { api } from '../services';

const CancelToken = axios.CancelToken;

export function useUsers(page, limit) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const source = CancelToken.source();
    const requestUsers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('api/v1/users', {
          cancelToken: source.token,
        });
        setUsers(data);
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
    requestUsers();

    return () => {
      source.cancel();
    };
  }, [page, limit]);

  return {
    users,
    error,
    loading,
  };
}
