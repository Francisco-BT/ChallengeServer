import { Container } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

import { useAuth } from '../../hooks';
import AccountsTable from './AccountsTable';

export default function AccountsPage() {
  const { logOut } = useAuth();
  const showToast = (message, type = 'default') => toast(message, { type });

  return (
    <Container style={{ marginTop: '30px' }}>
      <AccountsTable logOut={logOut} showToast={showToast} />
      <ToastContainer />
    </Container>
  );
}
