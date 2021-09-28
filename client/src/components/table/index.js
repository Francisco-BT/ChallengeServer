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
}) {
  return (
    <>
      <Table striped bordered hover responsive>
        {children}
      </Table>
      <Row>
        <Col sm={12} md={3} style={{ marginBottom: '20px' }}>
          <LimitSelector
            options={limitOptions}
            onLimitChange={onLimitChange}
            currentLimit={currentLimit}
          />
        </Col>
        <Col>
          <Pagination {...pagination} onPageChange={onPageChange} />
        </Col>
      </Row>
    </>
  );
}
