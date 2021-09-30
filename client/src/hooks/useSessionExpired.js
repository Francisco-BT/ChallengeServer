import { useCallback } from 'react';
import { useAuth } from '.';

export function useSessionExpired() {
  const { logOut } = useAuth();

  return useCallback(() => {
    return logOut(true);
  }, [logOut]);
}
