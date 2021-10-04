import { Route, Switch, Redirect } from 'react-router-dom';

import { PrivateRolesRouter } from '../components/router';
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
        <Redirect exact from="/" to="/home" />
        <PrivateRolesRouter validRoles={['SuperAdmin', 'Admin']}>
          <Route path="/users" component={UsersPage} />
          <Route path="/accounts/:id" component={AccountPage} />
          <Route path="/accounts" component={AccountsPage} />
          <Route path="/team-movements" component={TeamMovementsPage} />
        </PrivateRolesRouter>
      </Switch>
    </div>
  );
}
