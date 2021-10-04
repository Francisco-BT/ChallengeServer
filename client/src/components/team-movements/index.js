import { useState } from 'react';
import { Container } from 'react-bootstrap';

import LoaderIndicator from '../loader-indicator';
import FiltersForm from './FiltersForm';
import Table, { TableHead, TableBody, TableTitle } from '../table';
import { useTeamsMovements } from '../../hooks';
import { formatDate } from '../../utils';

export default function TeamMovementsPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const { movements, pagination, loading } = useTeamsMovements(
    page,
    limit,
    filters
  );

  return (
    <Container style={{ marginTop: '30px' }}>
      <TableTitle title="Team Movements Log" showPlusButton={false} />
      <FiltersForm onSubmit={(filters) => setFilters(filters)} />
      {loading ? (
        <LoaderIndicator />
      ) : (
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
                      movement.operation === 'Create'
                        ? '#86F28Ca1'
                        : '#EE3E3EA1'
                    }`,
                  }}
                >
                  {movement.operation}
                </td>
                <td>{movement.accountName}</td>
                <td>{movement.userName}</td>
                <td>{formatDate(movement.startDate)}</td>
                <td>{formatDate(movement.endDate)}</td>
              </tr>
            )}
          />
        </Table>
      )}
    </Container>
  );
}
