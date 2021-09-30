import { useState } from 'react';
import { Form } from 'react-bootstrap';

import Modal from '../modal';
import ValidationError from '../ValidationError';
import { DisableInput } from '../inputs';
import { useCreateAccount } from '../../hooks';

const newAccountInitialState = Object.freeze({
  name: '',
  clientName: '',
  responsibleName: '',
});

export default function NewAccountModal({
  open,
  onClose,
  onAction,
  showToast,
}) {
  const [account, setAccount] = useState(newAccountInitialState);
  const { loading, errors, createAccount } = useCreateAccount(
    account,
    () => {
      onClose();
      showToast('Account successfully created', 'success');
      onAction();
    },
    (message) => showToast(message, 'error')
  );

  return (
    <Modal
      open={open}
      title="New Account"
      onClose={onClose}
      onAction={createAccount}
      loading={loading}
    >
      <Form>
        <Form.Group className="mb-3" controlId="formAccountName">
          <Form.Label>Name</Form.Label>
          <DisableInput
            type="text"
            placeholder="Enter account name"
            value={account.name}
            onChange={(e) =>
              setAccount((account) => ({ ...account, name: e.target.value }))
            }
          />
          <ValidationError error={errors['name']} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAccountName">
          <Form.Label>Client Name</Form.Label>
          <DisableInput
            type="text"
            placeholder="Enter client name"
            value={account.clientName}
            onChange={(e) =>
              setAccount((account) => ({
                ...account,
                clientName: e.target.value,
              }))
            }
          />
          <ValidationError error={errors['clientName']} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formAccountName">
          <Form.Label>Responsible Name</Form.Label>
          <DisableInput
            type="text"
            placeholder="Enter the responsible name"
            value={account.responsibleName}
            onChange={(e) =>
              setAccount((account) => ({
                ...account,
                responsibleName: e.target.value,
              }))
            }
          />
          <ValidationError error={errors['responsibleName']} />
        </Form.Group>
      </Form>
    </Modal>
  );
}
