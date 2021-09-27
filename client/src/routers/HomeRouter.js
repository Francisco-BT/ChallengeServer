import { Route, Switch, Redirect } from 'react-router-dom';

import UsersPage from '../components/users';
import AccountsPage from '../components/accounts';
import NavBar from '../components/navbar';

export default function AppRouter() {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route exact path="/users" component={UsersPage} />
        <Route exact path="/accounts" component={AccountsPage} />
        <Route exact path="/home" component={() => <div>Home</div>} />
        <Redirect from="/" to="/home" />
      </Switch>
    </div>
  );
}
