import { Pagination } from 'react-bootstrap';
import './Pagination.css';

export default function MyPagination({
  currentPage = 1,
  hasNext,
  hasPrevious,
  totalPages = 1,
  onPageChange,
}) {
  return (
    <Pagination style={{ justifyContent: 'flex-end' }}>
      <Pagination.First
        disabled={!hasPrevious}
        onClick={() => onPageChange(1)}
      />
      <Pagination.Prev
        disabled={!hasPrevious}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {Array(totalPages)
        .fill(null)
        .map((_, idx) => {
          const realIdx = idx + 1;
          return (
            <Pagination.Item
              key={realIdx}
              active={realIdx === currentPage}
              onClick={() => onPageChange(realIdx)}
            >
              {idx + 1}
            </Pagination.Item>
          );
        })}

      <Pagination.Next
        disabled={!hasNext}
        onClick={() => onPageChange(currentPage + 1)}
      />
      <Pagination.Last
        disabled={!hasNext}
        onClick={() => onPageChange(totalPages)}
      />
    </Pagination>
  );
}
