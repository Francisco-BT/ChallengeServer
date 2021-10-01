import { Table, Row, Col } from 'react-bootstrap';

import Pagination from './pagination';
import LimitSelector from './LimitSelector';

export default function CustomTable({
  children,
  pagination,
  onPageChange = (_page) => {},
  currentLimit,
  onLimitChange,
  limitOptions,
  hidePagination = false,
  hideLimitSelector,
}) {
  return (
    <>
      <Table striped bordered hover responsive>
        {children}
      </Table>
      <Row>
        {hideLimitSelector ? null : (
          <Col sm={12} md={4} style={{ marginBottom: '20px' }}>
            <LimitSelector
              options={limitOptions}
              onLimitChange={onLimitChange}
              currentLimit={currentLimit}
            />
          </Col>
        )}
        {hidePagination ? null : (
          <Col>
            <Pagination {...pagination} onPageChange={onPageChange} />
          </Col>
        )}
      </Row>
    </>
  );
}
