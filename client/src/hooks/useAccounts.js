import { usePaginationRequest } from './usePaginationRequest';

export function useAccounts(page, limit) {
  const { items, pagination, loading, error } = usePaginationRequest(
    '/api/v1/accounts',
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
