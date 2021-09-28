import { useCallback } from 'react';

import { api } from '../services';
import { usePaginationRequest } from './usePaginationRequest';

export function useAccounts(page, limit) {
  const requestAccounts = useCallback((config) => {
    return api.get('/api/v1/accounts', config);
  }, []);

  const { items, pagination, loading, error } = usePaginationRequest(
    requestAccounts,
    page,
    limit
  );

  return {
    accounts: items,
    pagination,
    loading,
    error,
  };
}
