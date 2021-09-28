import { usePaginationRequest } from './usePaginationRequest';

export function useUsers(page, limit, fetchData) {
  const { items, pagination, loading, error } = usePaginationRequest(
    '/api/v1/users',
    page,
    limit,
    fetchData
  );

  return {
    users: items,
    pagination,
    error,
    loading,
  };
}
