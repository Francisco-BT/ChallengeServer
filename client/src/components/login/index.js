import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';

import { useAuth } from '../../hooks';
import LoginForm from './LoginForm';

export default function LogInPage() {
  const history = useHistory();
  const location = useLocation();
  const { singIn, authError, user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      let { from } = location.state || { from: { pathname: '/' } };
      history.replace(from);
    }
  }, [user, history, location.state]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#ce0002',
      }}
    >
      <LoginForm
        loading={loading}
        authError={authError}
        onSubmit={(email, password) =>
          singIn(email, password, history.replace('/'))
        }
      />
    </div>
  );
}
