import { useState } from 'react';

import { useAccounts } from '../../hooks';
import LoaderIndicator from '../loader-indicator';
import Table, {
  TableHead,
  TableBody,
  ActionsColumn,
  TableTitle,
} from '../table';
import NewUserModal from './NewAccountModal';

export default function AccountsTable({ logOut, showToast }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [fetchData, setFetchData] = useState(true);
  const refetchData = () => setFetchData((fetchData) => !fetchData);
  const { accounts, pagination, loading, error } = useAccounts(
    page,
    limit,
    fetchData
  );

  if (error) {
    if (error.logOut) {
      logOut();
    }
  }

  if (loading) {
    return <LoaderIndicator />;
  }

  return (
    <>
      <TableTitle title="Accounts" onClick={() => setOpen(true)} />
      <NewUserModal
        open={open}
        onClose={() => setOpen(false)}
        onAction={refetchData}
        showToast={showToast}
      />
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
    </>
  );
}
