import { useState } from 'react';
import { Form, Col, Row } from 'react-bootstrap';
import { faPen, faTrash, faUndo } from '@fortawesome/free-solid-svg-icons';

import { TableTitle } from '../table';
import { DisableInput, IconButton } from '../inputs';
import { useDeleteAccount, useUpdateAccount } from '../../hooks';
import ValidationError from '../ValidationError';

export default function AccountActions({ account, refetchData, onDelete }) {
  const [edit, setEdit] = useState(false);
  const [updatedAccount, setUpdatedAccount] = useState(() => ({
    name: account.name,
    clientName: account.clientName,
    responsibleName: account.responsibleName,
  }));
  const { deleteAccount } = useDeleteAccount(
    account.id,
    account.name,
    refetchData
  );

  const { errors, updateAccount } = useUpdateAccount(
    account.id,
    updatedAccount,
    refetchData
  );

  const updateFieldHandler = (e, field) => {
    setUpdatedAccount((account) => ({
      ...account,
      [field]: e.target.value,
    }));
  };

  return (
    <>
      <TableTitle title={`Account:  ${account.name}`} showPlusButton={false}>
        <IconButton
          icon={faTrash}
          tooltip="Delete"
          onClick={async () => {
            await deleteAccount();
            onDelete();
          }}
        />
        <IconButton
          icon={edit ? faUndo : faPen}
          tooltip={edit ? 'Undo' : 'Edit'}
          onClick={() => {
            if (edit) {
              setUpdatedAccount({ ...account });
            }
            setEdit((edit) => !edit);
          }}
        />
      </TableTitle>
      <Form>
        <Row className="mb-3">
          <Form.Group as={Col} sm={12} md={4} controlId="accountName">
            <Form.Label>Name</Form.Label>
            <DisableInput
              disabled={!edit}
              value={updatedAccount.name}
              type="text"
              placeholder="Account Name"
              onChange={(e) => updateFieldHandler(e, 'name')}
            />
            <ValidationError error={errors['name']} />
          </Form.Group>

          <Form.Group as={Col} sm={12} md={4} controlId="accountClient">
            <Form.Label>Client</Form.Label>
            <DisableInput
              disabled={!edit}
              type="text"
              value={updatedAccount.clientName}
              placeholder="Account Client Name"
              onChange={(e) => updateFieldHandler(e, 'clientName')}
            />
            <ValidationError error={errors['clientName']} />
          </Form.Group>

          <Form.Group as={Col} sm={12} md={4} controlId="accountResponsible">
            <Form.Label>Responsible</Form.Label>
            <DisableInput
              disabled={!edit}
              type="text"
              value={updatedAccount.responsibleName}
              placeholder="Account Responsible Name"
              onChange={(e) => updateFieldHandler(e, 'responsibleName')}
            />
            <ValidationError error={errors['responsibleName']} />
          </Form.Group>
        </Row>
        {edit ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton onClick={updateAccount}>Save</IconButton>
          </div>
        ) : null}
      </Form>
    </>
  );
}
