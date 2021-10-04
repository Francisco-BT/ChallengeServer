import { useState, useEffect } from 'react';

import { api } from '../services';
import { useSessionExpired } from '.';
import { requestHandler } from '../utils';

export function useUserProfile(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const sessionExpired = useSessionExpired();

  useEffect(() => {
    const { request, cleanUp } = requestHandler({
      setLoading,
      sessionExpired,
      setErrors,
      apiCall: async (unmounted, cancelToken) => {
        const { data: userData } = await api.get(`/api/v1/users/${id}`, {
          cancelToken,
        });
        !unmounted && setData(userData);
      },
    });

    request();
    return cleanUp;
  }, [id, sessionExpired]);

  return {
    userData: data,
    loading,
    errors,
  };
}
