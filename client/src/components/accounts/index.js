import { useState } from 'react';
import { Container } from 'react-bootstrap';

import { useAccounts } from '../../hooks';
import LoaderIndicator from '../loader-indicator';
import Table, { TableHead, TableBody, TableTitle } from '../table';
import NewUserModal from './NewAccountModal';

export default function AccountsTable({ history, match }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [fetchData, setFetchData] = useState(true);
  const refetchData = () => setFetchData((fetchData) => !fetchData);
  const { accounts, pagination, loading } = useAccounts(page, limit, fetchData);

  if (loading) {
    return <LoaderIndicator />;
  }

  return (
    <Container style={{ marginTop: '30px' }}>
      <TableTitle title="Accounts" onClick={() => setOpen(true)} />
      <NewUserModal
        open={open}
        onClose={() => setOpen(false)}
        onAction={refetchData}
      />
      <Table
        pagination={pagination}
        onPageChange={(page) => setPage(page)}
        currentLimit={limit}
        onLimitChange={(limit) => setLimit(limit)}
      >
        <TableHead labels={['#', 'Name', 'Client', 'Responsible']} />
        <TableBody
          items={accounts}
          renderFunction={(account) => (
            <tr
              key={account.id}
              style={{ cursor: 'pointer' }}
              onClick={() => history.push(`${match.path}/${account.id}`)}
            >
              <td>{account.id}</td>
              <td>{account.name}</td>
              <td>{account.clientName}</td>
              <td>{account.responsibleName}</td>
            </tr>
          )}
        />
      </Table>
    </Container>
  );
}
