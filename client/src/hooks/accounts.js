import { useState } from 'react';

import { api } from '../services';
import { usePaginationRequest, useSessionExpired } from '.';
import { requestHandler } from '../utils';
import { useToast } from './useToast';

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
  const sessionExpired = useSessionExpired();
  const { errorToast, successToast } = useToast();

  const createAccount = async () => {
    const { request } = requestHandler({
      setLoading,
      setErrors,
      sessionExpired,
      onError: errorToast,
      apiCall: async (_, cancelToken) => {
        await api.post('/api/v1/accounts', account, {
          cancelToken,
        });
        successToast('Account successfully created');
        onSuccess();
      },
    });
    request();
  };

  return {
    loading,
    errors,
    createAccount,
  };
}
