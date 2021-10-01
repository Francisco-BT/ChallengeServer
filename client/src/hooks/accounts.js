import { useState, useEffect } from 'react';

import { api } from '../services';
import { usePaginationRequest, useSessionExpired } from '.';
import { requestHandler } from '../utils';
import { useToast } from './useToast';

export function useAccounts(page, limit, fetchData) {
  const { items, pagination, loading, error } = usePaginationRequest(
    '/api/v1/accounts',
    page,
    limit,
    fetchData
  );

  return {
    accounts: items,
    pagination,
    loading,
    error,
  };
}

export function useCreateAccount(account, onSuccess, onError) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const sessionExpired = useSessionExpired();
  const { errorToast, successToast } = useToast();

  const createAccount = async () => {
    const { request } = requestHandler({
      setLoading,
      setErrors,
      sessionExpired,
      onError: errorToast,
      apiCall: async (_, cancelToken) => {
        await api.post('/api/v1/accounts', account, {
          cancelToken,
        });
        successToast('Account successfully created');
        onSuccess();
      },
    });
    request();
  };

  return {
    loading,
    errors,
    createAccount,
  };
}

export function useAccount(id, fetchData) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [account, setAccount] = useState({
    name: '',
    clientName: '',
    responsibleName: '',
    team: [],
  });
  const sessionExpired = useSessionExpired();

  useEffect(() => {
    const { request, cleanUp } = requestHandler({
      setLoading,
      setErrors,
      sessionExpired,
      apiCall: async (unmounted, cancelToken) => {
        const { data } = await api.get(`/api/v1/accounts/${id}`, {
          cancelToken,
        });
        !unmounted && setAccount(data);
      },
    });

    request();

    return cleanUp;
  }, [id, fetchData, sessionExpired]);

  return {
    loading,
    errors,
    account,
  };
}

export function useDeleteAccount(id, name, fetchData) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const sessionExpired = useSessionExpired();
  const { errorToast, successToast } = useToast();

  const deleteAccount = async () => {
    const { request } = requestHandler({
      setErrors,
      setLoading,
      sessionExpired,
      onError: errorToast,
      apiCall: async (_, cancelToken) => {
        await api.delete(`/api/v1/accounts/${id}`, {
          cancelToken,
        });
        fetchData();
        successToast(`Account: ${name} has been deleted`);
      },
    });
    request();
  };

  return {
    deleteAccount,
    loading,
    errors,
  };
}

export function useUpdateAccount(id, data, fetchData) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const sessionExpired = useSessionExpired();
  const { errorToast, successToast } = useToast();

  const updateAccount = async () => {
    const { request } = requestHandler({
      setErrors,
      setLoading,
      sessionExpired,
      onError: errorToast,
      apiCall: async (_, cancelToken) => {
        await api.put(`/api/v1/accounts/${id}`, data, {
          cancelToken,
        });
        fetchData();
        successToast(`Account has been updated`);
      },
    });
    request();
  };

  return {
    updateAccount,
    loading,
    errors,
  };
}

export function useAddTeamToAccount(fetchData) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { successToast, errorToast } = useToast();
  const sessionExpired = useSessionExpired();

  const addTeamToAccount = async (teamData) => {
    const { request } = requestHandler({
      sessionExpired,
      setErrors,
      setLoading,
      onError: errorToast,
      apiCall: async (_, cancelToken) => {
        await api.post('/api/v1/teams', teamData, {
          cancelToken,
        });

        successToast('Team members added successfully');
        fetchData();
      },
    });
    request();
  };

  return { loading, errors, addTeamToAccount };
}
