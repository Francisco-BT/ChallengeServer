import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ActionsColumn() {
  return (
    <td>
      <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
        <FontAwesomeIcon
          icon={faEye}
          color="#ce0002"
          onClick={() => console.log('Eye pressed')}
          style={{ cursor: 'pointer' }}
        />
        <FontAwesomeIcon
          icon={faEdit}
          color="#ce0002"
          onClick={() => console.log('Edit pressed')}
          style={{ cursor: 'pointer' }}
        />
        <FontAwesomeIcon
          icon={faTrash}
          color="#ce0002"
          onClick={() => console.log('Trash pressed')}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </td>
  );
}
