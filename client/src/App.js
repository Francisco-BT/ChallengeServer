import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ProvideAuth } from './auth';
import { AppRouter } from './routers';

function App() {
  return (
    <ProvideAuth>
      <AppRouter />
    </ProvideAuth>
  );
}

export default App;
