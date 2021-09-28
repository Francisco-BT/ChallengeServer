import { usePaginationRequest } from './usePaginationRequest';

export function useUsers(page, limit) {
  const { items, pagination, loading, error } = usePaginationRequest(
    '/api/v1/users',
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
