import { Pagination } from 'react-bootstrap';
import './Pagination.css';

export default function MyPagination({ totalPages = 1 }) {
  return (
    <Pagination
      style={{ justifyContent: 'flex-end', color: '#ce0002!important;' }}
    >
      <Pagination.First />
      <Pagination.Prev />

      {Array(totalPages)
        .fill(null)
        .map((_, idx) => (
          <Pagination.Item active>{idx + 1}</Pagination.Item>
        ))}

      <Pagination.Next />
      <Pagination.Last />
    </Pagination>
  );
}
