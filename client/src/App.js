import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ProvideAuth } from './auth';
import { AppRouter } from './routers';

function App() {
  return (
    <ProvideAuth>
      <AppRouter />
      <ToastContainer />
    </ProvideAuth>
  );
}

export default App;
