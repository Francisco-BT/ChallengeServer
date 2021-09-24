import { Route, Switch, Link, Redirect } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import { useAuth } from '../auth';
import UsersPage from '../components/users';
import AccountsPage from '../components/accounts';

export default function AppRouter() {
  const auth = useAuth();
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/accounts">Accounts</Link>
          </li>
        </ul>
        <Button variant={'outline-dark'} onClick={auth.logOut}>
          Log Out
        </Button>
      </nav>

      <Switch>
        <Route exact path="/users" component={UsersPage} />
        <Route exact path="/accounts" component={AccountsPage} />
        <Route exact path="/home" component={() => <div>Home</div>} />
        <Redirect from="/" to="/home" />
      </Switch>
    </div>
  );
}
