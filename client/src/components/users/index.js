import { useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import LoaderIndicator from '../loader-indicator';
import UserModal from './UserModal';
import Table, { TableHead, TableBody, ActionsColumn } from '../table';
import { useUsers, useAuth } from '../../hooks';

const formPropsInitialState = {
  open: false,
  viewing: false,
  editing: false,
  userData: null,
};
export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [fetchData, setFetchData] = useState(true);
  const [modalProps, setModalProps] = useState(formPropsInitialState);
  const triggerDataFetch = () => setFetchData((fetchData) => !fetchData);
  const { users, pagination, error, loading } = useUsers(
    page,
    limit,
    fetchData
  );
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3
          style={{
            marginBottom: '30px',
            fontSize: '2rem',
            fontWeight: '800',
            color: '#ce0002',
            display: 'inline',
          }}
        >
          Users
        </h3>
        <Button
          style={{
            height: '40px',
            backgroundColor: '#ce0002',
            borderColor: '#ce0002',
          }}
          onClick={() =>
            setModalProps({ ...formPropsInitialState, open: true })
          }
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
      <UserModal
        {...modalProps}
        onClose={() => setModalProps((state) => ({ ...state, open: false }))}
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
                  setModalProps((props) => ({
                    ...props,
                    open: true,
                    viewing: true,
                    userData: user,
                  }))
                }
              />
            </tr>
          )}
        />
      </Table>
    </Container>
  );
}
