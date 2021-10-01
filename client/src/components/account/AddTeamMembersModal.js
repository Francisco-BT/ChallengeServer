import { useState, useMemo, useEffect } from 'react';
import { FormCheck } from 'react-bootstrap';

import Modal from '../modal';
import LoaderIndicator from '../loader-indicator';
import Table, { TableHead, TableBody } from '../table';
import { useUsers, useToast, useAddTeamToAccount } from '../../hooks';

const LIMIT_USERS_PER_REQUEST = 10;

const canSelectedMore = (currentLength, customToast) => {
  if (currentLength > LIMIT_USERS_PER_REQUEST) {
    customToast(
      `You only can send ${LIMIT_USERS_PER_REQUEST} team members per request`,
      {
        type: 'warning',
        toastId: 'cannotSelectMore',
      }
    );
    return false;
  }

  return true;
};

export default function AddTeamMembersModal({
  open,
  onClose,
  teamIds,
  accountId,
  refetchData,
}) {
  const query = useMemo(() => {
    return { ids: teamIds };
  }, [teamIds]);

  const [page, setPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [checkAllInPage, setCheckAllInPage] = useState(false);
  const { customToast } = useToast();
  const { loading, users, pagination } = useUsers(page, 10, false, query);
  const { addTeamToAccount, loading: teamLoading } = useAddTeamToAccount(() => {
    refetchData();
    onClose();
  });

  useEffect(() => {
    const usersPage = users.map((u) => u.id);
    if (!usersPage.every((u) => selectedUsers.includes(u))) {
      setCheckAllInPage(false);
    } else {
      setCheckAllInPage(true);
    }
  }, [users, selectedUsers]);

  useEffect(() => {
    let unmounted = false;
    if (!open && !unmounted) {
      setPage(1);
      setSelectedUsers([]);
    }

    return () => {
      unmounted = true;
    };
  }, [open]);

  const handleSelectAll = () => {
    setCheckAllInPage((checked) => {
      const isChecked = !checked;
      const userIds = users.map((u) => u.id);

      if (isChecked) {
        const newSelectedUsers = Array.from(
          new Set([...selectedUsers, ...userIds])
        );

        if (!canSelectedMore(newSelectedUsers.length, customToast)) {
          return checked;
        }

        setSelectedUsers(newSelectedUsers);
      } else {
        setSelectedUsers((selected) => [
          ...selected.filter((s) => !userIds.includes(s)),
        ]);
      }

      return isChecked;
    });
  };

  const handleSelect = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers((selected) => [...selected.filter((s) => s !== id)]);
    } else {
      if (!canSelectedMore(selectedUsers.length + 1, customToast)) {
        return;
      }

      setSelectedUsers((selected) => [...selected, id]);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Team Members"
      loading={teamLoading}
      onAction={() => addTeamToAccount({ accountId, members: selectedUsers })}
    >
      {loading && <LoaderIndicator />}
      <Table
        hideLimitSelector
        pagination={pagination}
        onPageChange={(page) => setPage(page)}
        currentLimit={10}
      >
        <TableHead
          labels={[
            <FormCheck checked={checkAllInPage} onChange={handleSelectAll} />,
            'Name',
            'Email',
            'Role',
          ]}
        />
        <TableBody
          items={users}
          renderFunction={(user) => (
            <tr key={user.id}>
              <td>
                <FormCheck
                  onChange={() => handleSelect(user.id)}
                  checked={selectedUsers.includes(user.id)}
                  value={user.id}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          )}
        />
      </Table>
    </Modal>
  );
}
