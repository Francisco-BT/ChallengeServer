import { Form } from 'react-bootstrap';

export default function LimitSelector({
  options = [10, 20, 30],
  currentLimit = options[0],
  onLimitChange = (_limit) => {},
}) {
  return (
    <Form.Select
      aria-label="Items Per Page: 10"
      value={currentLimit}
      onChange={(e) => onLimitChange(e.target.value)}
    >
      {options.map((option) => (
        <option selected={option === currentLimit} value={option}>
          Items Per Page: {option}
        </option>
      ))}
    </Form.Select>
  );
}
