import { Route, Switch, Redirect } from 'react-router-dom';

import NavBar from '../components/navbar';
import HomePage from '../components/home';
import UsersPage from '../components/users';
import AccountsPage from '../components/accounts';
import TeamMovementsPage from '../components/team-movements';
import AccountPage from '../components/account';

export default function AppRouter() {
  return (
    <div>
      <NavBar />
      <Switch>
        <Route path="/home" component={HomePage} />
        <Route path="/users" component={UsersPage} />
        <Route path="/accounts/:id" component={AccountPage} />
        <Route path="/accounts" component={AccountsPage} />
        <Route path="/team-movements" component={TeamMovementsPage} />
        <Redirect from="/" to="/home" />
      </Switch>
    </div>
  );
}
