import axios from 'axios';
import { useState, useCallback } from 'react';

import { api } from '../services';
import { usePaginationRequest } from './usePaginationRequest';

export function useAccounts(page, limit, fetchData) {
  const { items, pagination, loading, error } = usePaginationRequest(
    '/api/v1/accounts',
    page,
    limit,
    fetchData
  );

  return {
    accounts: items,
    pagination,
    loading,
    error,
  };
}

export function useCreateAccount(account, onSuccess, onError) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const createAccount = useCallback(async () => {
    setLoading(true);
    setErrors({});
    const source = axios.CancelToken.source();
    try {
      await api.post('/api/v1/accounts', account, {
        cancelToken: source.token,
      });
      onSuccess();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        onError('Some fields has invalid values, please try again');
        return setErrors(error.response.data.errors);
      }

      let message = 'Something went wrong, please try again';
      if (error.response && error.response.data) {
        message = error.response.data.message;
      }
      onError(message, 'error');
      setErrors({ message });
    } finally {
      setLoading(false);
    }
  }, [account, onSuccess, onError]);

  return {
    loading,
    errors,
    createAccount,
  };
}
