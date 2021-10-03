import { usePaginationRequest } from './usePaginationRequest';

export function useTeamsMovements(page, limit, query) {
  const { items, pagination, loading, error } = usePaginationRequest(
    '/api/v1/teams',
    page,
    limit,
    query
  );

  return {
    movements: items,
    pagination,
    error,
    loading,
  };
}
