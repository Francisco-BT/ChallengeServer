import { useCallback } from 'react';
import { api } from '../services';
import { usePaginationRequest } from './usePaginationRequest';

export function useUsers(page, limit) {
  const requestFn = useCallback((config) => {
    return api.get('/api/v1/users', config);
  }, []);

  const { items, pagination, loading, error } = usePaginationRequest(
    requestFn,
    page,
    limit
  );

  return {
    users: items,
    pagination,
    error,
    loading,
  };
}
