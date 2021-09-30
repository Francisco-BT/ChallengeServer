import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { api } from '../services';

export function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const userInStorage = localStorage.getItem('user');

    if (userInStorage) {
      try {
        return setUser(JSON.parse(userInStorage));
      } catch {
        return setUser(null);
      }
    }
    setUser(null);
  }, []);

  const singIn = async (email, password, cb) => {
    setAuthError(null);
    try {
      const { data: user } = await api.post('/api/v1/users/auth', {
        email,
        password,
      });
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      cb();
    } catch {
      setAuthError('Invalid Credentials');
    }
    return user;
  };

  const logOut = (sessionExpired = false, cb = () => {}) => {
    if (sessionExpired) {
      toast('Your session has expired. Please log in again.', {
        type: 'info',
        theme: 'colored',
        toastId: -1,
      });
    }
    setUser(null);
    setAuthError(null);
    localStorage.removeItem('user');
    cb();
  };

  return {
    user,
    authError,
    singIn,
    logOut,
  };
}
