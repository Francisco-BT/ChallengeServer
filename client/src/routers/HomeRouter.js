import { Route, Switch, Redirect } from 'react-router-dom';

import NavBar from '../components/navbar';
import HomePage from '../components/home';
import UsersPage from '../components/users';
import AccountsPage from '../components/accounts';

export default function AppRouter() {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route exact path="/home" component={HomePage} />
        <Route exact path="/users" component={UsersPage} />
        <Route exact path="/accounts" component={AccountsPage} />
        <Redirect from="/" to="/home" />
      </Switch>
    </div>
  );
}
