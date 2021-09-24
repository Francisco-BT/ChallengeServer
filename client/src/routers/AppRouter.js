import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import LogInPage from '../components/login';
import HomeRouter from './HomeRouter';
import PrivateRoute from '../components/router';
import { useAuth } from '../hooks';

export function AppRouter() {
  const auth = useAuth();

  return (
    <Router>
      <div>
        {auth.user ? <Redirect to="/" /> : null}
        <Switch>
          <Route exact path="/login" component={LogInPage} />
          <PrivateRoute path="/">
            <HomeRouter />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}
