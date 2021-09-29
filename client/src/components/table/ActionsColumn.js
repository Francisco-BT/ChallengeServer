import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export function ActionsColumn({ children, onSee, onEdit, onDelete }) {
  return (
    <td>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <FontAwesomeIcon
          icon={faEye}
          color="#ce0002"
          onClick={onSee}
          style={{ cursor: 'pointer' }}
        />
        <FontAwesomeIcon
          icon={faEdit}
          color="#ce0002"
          onClick={onEdit}
          style={{ cursor: 'pointer' }}
        />
        <FontAwesomeIcon
          icon={faTrash}
          color="#ce0002"
          onClick={onDelete}
          style={{ cursor: 'pointer' }}
        />
        {children}
      </div>
    </td>
  );
}
