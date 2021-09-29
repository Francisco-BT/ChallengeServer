import axios from 'axios';
import { useCallback, useState } from 'react';
import { usePaginationRequest } from './usePaginationRequest';

import { api } from '../services';

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

export function useSaveUser(editing, user, id, onSuccess, onError) {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const saveUser = useCallback(async () => {
    let request;
    const source = axios.CancelToken.source();
    setLoading(true);
    setErrors({});

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
        cancelToken: source.token,
      });
    } else {
      request = api.post('/api/v1/users', data, { cancelToken: source.token });
    }
    try {
      await request;
      onSuccess();
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors);
        onError('Some fields have invalid values');
      } else {
        onError('Something went wrong, please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [editing, user, id, onSuccess, onError]);

  return {
    errors,
    loading,
    saveUser,
  };
}

export function useDeleteUser({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const deleteUser = useCallback(
    async (id, name) => {
      const source = axios.CancelToken.source();
      setLoading(true);
      setErrors({});
      try {
        await api.delete(`/api/v1/users/${id}`, {
          cancelToken: source.token,
        });
        onSuccess((name = ''));
        return true;
      } catch {
        const message =
          'There was an error deleting the user, please try again.';
        setErrors({
          message,
        });
        onError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, onError]
  );

  return { loading, errors, deleteUser };
}
