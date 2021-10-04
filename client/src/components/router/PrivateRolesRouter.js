import { Redirect, Route } from 'react-router';
import { useAuth } from '../../auth';

export default function PrivateRolesRouter({
  children,
  validRoles = [],
  ...rest
}) {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        user && user.role && validRoles.includes(user.role) ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
