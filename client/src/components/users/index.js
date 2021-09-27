import { useState } from 'react';
import { Container } from 'react-bootstrap';

import { useUsers, useAuth } from '../../hooks';
import LoaderIndicator from '../loader-indicator';
import Table from '../table';
import TableHead from './table-head';
import TableBody from './table-body';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { users, error, loading } = useUsers(page, limit);
  const { logOut } = useAuth();

  if (error) {
    if (error.logOut) {
      logOut();
    }
  }

  if (loading) {
    return <LoaderIndicator />;
  }

  return (
    <Container style={{ marginTop: '100px' }}>
      <Table>
        <TableHead />
        <TableBody users={users} />
      </Table>
    </Container>
  );
}
