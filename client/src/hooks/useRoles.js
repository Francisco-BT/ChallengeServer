import { usePaginationRequest } from './usePaginationRequest';

export function useRoles() {
  const { items, error, loading } = usePaginationRequest(
    '/api/v1/roles',
    0,
    0,
    'roles'
  );

  return {
    roles: items,
    error,
    loading,
  };
}
