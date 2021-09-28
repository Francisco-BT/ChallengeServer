import { useState } from 'react';
import { Container } from 'react-bootstrap';

import LoaderIndicator from '../loader-indicator';
import Table, { TableHead, TableBody, ActionsColumn } from '../table';
import { useUsers, useAuth } from '../../hooks';

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { users, pagination, error, loading } = useUsers(page, limit);
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
    <Container style={{ marginTop: '30px' }}>
      <h3
        style={{
          marginBottom: '30px',
          fontSize: '2rem',
          fontWeight: '800',
          color: '#ce0002',
        }}
      >
        Users
      </h3>
      <Table
        pagination={pagination}
        onPageChange={(page) => setPage(page)}
        currentLimit={limit}
        onLimitChange={(limit) => setLimit(limit)}
      >
        <TableHead labels={['#', 'Name', 'Email', 'Actions']} />
        <TableBody
          items={users}
          renderFunction={(user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <ActionsColumn />
            </tr>
          )}
        />
      </Table>
    </Container>
  );
}
