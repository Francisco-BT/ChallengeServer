import { usePaginationRequest } from './usePaginationRequest';

export function useTeamsMovements(page, limit) {
  const { items, pagination, loading, error } = usePaginationRequest(
    '/api/v1/teams',
    page,
    limit
  );

  return {
    movements: items,
    pagination,
    error,
    loading,
  };
}
