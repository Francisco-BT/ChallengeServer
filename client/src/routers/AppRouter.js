import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LogInPage from '../components/login';
import HomeRouter from './HomeRouter';
import PrivateRoute from '../components/router';

export function AppRouter() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/login" component={LogInPage} />
          <PrivateRoute path="/">
            <HomeRouter />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}
