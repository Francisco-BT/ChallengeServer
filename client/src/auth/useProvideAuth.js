import { useState, useEffect } from 'react';
import axios from 'axios';

export function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const userInStorage = localStorage.getItem('user');
    if (userInStorage) {
      return setUser(userInStorage);
    }
    setUser(null);
  }, []);

  const singIn = async (email, password) => {
    setAuthError(null);
    try {
      const { data: user } = await axios.post('api/v1/users/auth', {
        email,
        password,
      });
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    } catch {
      setAuthError('Invalid Credentials');
    }
    return user;
  };

  const logOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return {
    user,
    authError,
    singIn,
    logOut,
  };
}
