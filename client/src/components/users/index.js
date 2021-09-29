import { Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

import UsersTable from './UsersTable';
import { useAuth } from '../../hooks';

export default function UsersPage() {
  const { logOut } = useAuth();
  const showToast = (message, type = 'default') =>
    toast(message, {
      type,
    });

  return (
    <Container style={{ marginTop: '30px' }}>
      <UsersTable logOut={logOut} showToast={showToast} />
      <ToastContainer />
    </Container>
  );
}
