import { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';

const filtersInitialState = Object.freeze({
  accountName: '',
  userName: '',
  startDate: '',
  endDate: '',
});
export default function FiltersForm({ onSubmit }) {
  const [filters, setFilters] = useState(filtersInitialState);

  const handleFilterChange = (e) => {
    setFilters((filters) => ({
      ...filters,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div>
      <span className="w-auto">Filters</span>
      <hr />
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            accountName: filters.accountName || undefined,
            userName: filters.userName || undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
          });
        }}
      >
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Account</Form.Label>
            <Form.Control
              name="accountName"
              type="text"
              placeholder="Account Name"
              value={filters.accountName}
              onChange={handleFilterChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formGridPassword">
            <Form.Label>Team Member</Form.Label>
            <Form.Control
              name="userName"
              type="text"
              placeholder="Team Member Name"
              value={filters.userName}
              onChange={handleFilterChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              name="startDate"
              type="date"
              placeholder="Start Date"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              name="endDate"
              type="date"
              placeholder="End Date"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </Form.Group>
        </Row>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="reset"
            style={{ marginRight: '10px' }}
            variant="secondary"
            onClick={() => {
              setFilters(filtersInitialState);
              onSubmit({});
            }}
          >
            Clear Filters
          </Button>
          <Button type="submit" style={{ alignSelf: 'flex-end' }}>
            Filter
          </Button>
        </div>
      </Form>
      <hr />
    </div>
  );
}
