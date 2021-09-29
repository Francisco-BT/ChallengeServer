import { useState } from 'react';

import LoaderIndicator from '../loader-indicator';
import Table, {
  TableHead,
  TableBody,
  ActionsColumn,
  TableTitle,
} from '../table';
import UserModal from './UserModal';
import { useUsers, useDeleteUser, useDeleteModal } from '../../hooks';

const modalPropsInitialState = Object.freeze({
  open: false,
  viewing: false,
  editing: false,
  userData: null,
});

export default function UsersTable({ logOut, showToast }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [fetchData, setFetchData] = useState(true);
  const [modalProps, setModalProps] = useState(modalPropsInitialState);
  const triggerDataFetch = () => setFetchData((fetchData) => !fetchData);
  const fire = useDeleteModal();
  const { deleteUser } = useDeleteUser({
    onSuccess: (name) => {
      showToast(`User ${name} has been deleted`, 'success');
      triggerDataFetch();
    },
    onError: (message) => showToast(message, 'error'),
  });
  const { users, pagination, error, loading } = useUsers(
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
      <TableTitle
        title="Users"
        onClick={() => setModalProps({ ...modalPropsInitialState, open: true })}
      />
      <UserModal
        {...modalProps}
        showToast={showToast}
        onClose={() => setModalProps(modalPropsInitialState)}
        onAction={triggerDataFetch}
      />
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
              <ActionsColumn
                onSee={() =>
                  setModalProps({
                    ...modalPropsInitialState,
                    open: true,
                    viewing: true,
                    userData: user,
                  })
                }
                onEdit={() =>
                  setModalProps({
                    ...modalPropsInitialState,
                    open: true,
                    editing: true,
                    userData: user,
                  })
                }
                onDelete={() => {
                  fire(() => deleteUser(user.id, user.name));
                }}
              />
            </tr>
          )}
        />
      </Table>
    </>
  );
}
