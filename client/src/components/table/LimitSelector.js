import { Form, Row, Col } from 'react-bootstrap';

export default function LimitSelector({
  options = [10, 20, 30],
  currentLimit = options[0],
  onLimitChange = (_) => {},
}) {
  return (
    <Row>
      <Col style={{ paddingRight: '0' }} xs={5}>
        <Form.Label>Items per page:</Form.Label>
      </Col>
      <Col xs={4}>
        <Form.Select
          aria-label="Items Per Page: 10"
          value={currentLimit}
          onChange={(e) => onLimitChange(e.target.value)}
        >
          {options.map((option, idx) => (
            <option key={option + idx} value={option}>
              {option}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  );
}
