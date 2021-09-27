import axios from 'axios';
import { useState, useEffect } from 'react';

import { api } from '../services';

const CancelToken = axios.CancelToken;
export function useUserProfile(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const source = CancelToken.source();
    const requestUserData = async () => {
      try {
        setLoading(true);
        const { data: userData } = await api.get(`/api/v1/users/${id}`, {
          cancelToken: source.token,
        });
        setData(userData);
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

    requestUserData();
    return () => {
      source.cancel();
    };
  }, [id]);

  return {
    userData: data,
    loading,
    error,
  };
}
