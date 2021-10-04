import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function IconButton({ children, icon, onClick, tooltip }) {
  const renderButton = () => (
    <Button
      style={{
        height: icon ? '40px' : '',
        marginBottom: '8px',
        marginLeft: '8px',
        backgroundColor: '#ce0002',
        borderColor: '#ce0002',
      }}
      onClick={onClick}
    >
      {icon ? <FontAwesomeIcon icon={icon} /> : null}
      {children}
    </Button>
  );
  return tooltip ? (
    <OverlayTrigger overlay={<Tooltip id={`${tooltip}`}>{tooltip}</Tooltip>}>
      {renderButton()}
    </OverlayTrigger>
  ) : (
    renderButton()
  );
}
