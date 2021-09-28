import { useState } from 'react';
import { Container } from 'react-bootstrap';

import LoaderIndicator from '../loader-indicator';
import Table, { TableHead, TableBody } from '../table';
import { useTeamsMovements, useAuth } from '../../hooks';

export default function TeamMovementsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const { movements, pagination, error, loading } = useTeamsMovements(
    page,
    limit
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
      <h3
        style={{
          marginBottom: '30px',
          fontSize: '2rem',
          fontWeight: '800',
          color: '#ce0002',
        }}
      >
        Team Movements Log
      </h3>
      <Table
        limitOptions={[50, 100, 200]}
        pagination={pagination}
        onPageChange={(page) => setPage(page)}
        currentLimit={limit}
        onLimitChange={(limit) => setLimit(limit)}
      >
        <TableHead
          labels={['Operation', 'Team', 'Member', 'Start Date', 'End Date']}
        />
        <TableBody
          items={movements}
          renderFunction={(movement) => (
            <tr key={movement.id} style={{ cursor: 'default' }}>
              <td
                style={{
                  backgroundColor: `${
                    movement.operation === 'Create' ? '#86F28Ca1' : '#EE3E3EA1'
                  }`,
                }}
              >
                {movement.operation}
              </td>
              <td>{movement.accountName}</td>
              <td>{movement.userName}</td>
              <td>{movement.startDate}</td>
              <td>{movement.endDate || '---'}</td>
            </tr>
          )}
        />
      </Table>
    </Container>
  );
}
