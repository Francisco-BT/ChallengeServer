import { useCallback, useState } from 'react';

import { api } from '../services';
import { requestHandler } from '../utils';
import { usePaginationRequest, useSessionExpired, useToast } from '.';

export function useUsers(page, limit, fetchData, query) {
  const { items, pagination, loading, error } = usePaginationRequest(
    '/api/v1/users',
    page,
    limit,
    fetchData,
    query
  );

  return {
    users: items,
    pagination,
    error,
    loading,
  };
}

export function useSaveUser(editing, user, id, onSuccess) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const sessionExpired = useSessionExpired();
  const { errorToast, successToast } = useToast();
  const saveUser = async () => {
    const { request } = requestHandler({
      setLoading,
      setErrors,
      sessionExpired,
      onError: errorToast,
      apiCall: async (_, cancelToken) => {
        let request;
        const data = {
          ...user,
          cvLink: user.cvLink ? user.cvLink : undefined,
          englishLevel: user.englishLevel ? user.englishLevel : undefined,
          technicalKnowledge: user.technicalKnowledge
            ? user.technicalKnowledge
            : undefined,
        };

        if (editing) {
          request = api.put(`/api/v1/users/${id}`, data, {
            cancelToken,
          });
        } else {
          request = api.post('/api/v1/users', data, {
            cancelToken,
          });
        }

        await request;
        successToast(
          editing
            ? 'User was updated successfully'
            : 'User was created successfully'
        );
        onSuccess();
      },
    });
    request();
  };

  return {
    errors,
    loading,
    saveUser,
    clear: useCallback(() => setErrors({}), []),
  };
}

export function useDeleteUser({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const sessionExpired = useSessionExpired();
  const { errorToast, successToast } = useToast();

  const deleteUser = async (id, name) => {
    const { request } = requestHandler({
      setLoading,
      setErrors,
      sessionExpired,
      onError: errorToast,
      apiCall: async (_, cancelToken) => {
        await api.delete(`/api/v1/users/${id}`, {
          cancelToken,
        });
        successToast(`User ${name} has been deleted`);
        onSuccess();
        return true;
      },
    });

    request();
  };

  return { loading, errors, deleteUser };
}
