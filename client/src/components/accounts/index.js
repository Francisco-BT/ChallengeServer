import { useState } from 'react';
import { Container } from 'react-bootstrap';

import { useAccounts, useAuth } from '../../hooks';
import LoaderIndicator from '../loader-indicator';
import Table, { TableHead, TableBody, ActionsColumn } from '../table';

export default function AccountsPage() {
  const { logOut } = useAuth();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { accounts, pagination, loading, error } = useAccounts(page, limit);

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
        Accounts
      </h3>
      <Table
        pagination={pagination}
        onPageChange={(page) => setPage(page)}
        currentLimit={limit}
        onLimitChange={(limit) => setLimit(limit)}
      >
        <TableHead labels={['#', 'Name', 'Client', 'Responsible', 'Actions']} />
        <TableBody
          items={accounts}
          renderFunction={(account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.name}</td>
              <td>{account.clientName}</td>
              <td>{account.responsibleName}</td>
              <ActionsColumn />
            </tr>
          )}
        />
      </Table>
    </Container>
  );
}
