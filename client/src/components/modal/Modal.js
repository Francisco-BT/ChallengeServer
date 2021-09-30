import { Modal, Button } from 'react-bootstrap';

export default function MyModal({
  children,
  open,
  title,
  closeLabel = 'Cancel',
  actionLabel = 'Save',
  onClose,
  onAction,
  loading,
  hideActionButton,
}) {
  return (
    <Modal
      centered
      show={open}
      onHide={onClose}
      backdrop={loading ? 'static' : true}
    >
      <Modal.Header closeButton onClick={onClose} disabled={loading}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{children}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {closeLabel}
        </Button>
        {!hideActionButton ? (
          <Button variant="primary" onClick={onAction} disabled={loading}>
            {actionLabel}
          </Button>
        ) : null}
      </Modal.Footer>
    </Modal>
  );
}
