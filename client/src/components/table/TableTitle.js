import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function TableTitle({ title, showButton = true, onClick }) {
  return (
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
        {title}
      </h3>
      <Button
        style={{
          height: '40px',
          backgroundColor: '#ce0002',
          borderColor: '#ce0002',
        }}
        onClick={onClick}
      >
        <FontAwesomeIcon icon={faPlus} />
      </Button>
    </div>
  );
}
