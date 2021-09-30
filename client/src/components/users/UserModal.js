import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';

import Modal from '../modal';
import ValidationError from '../ValidationError';
import { DisableInput, DisableSelect } from '../inputs';
import { useRoles, useSaveUser } from '../../hooks';

const englishLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const userInitialState = Object.freeze({
  name: '',
  email: '',
  password: '',
  roleId: '',
  englishLevel: '',
  cvLink: '',
  technicalKnowledge: '',
});

export default function UserModal({
  open,
  editing,
  viewing,
  userData,
  onClose,
  onAction,
  showToast,
}) {
  const isNewUser = !editing && !viewing;
  const { roles } = useRoles();
  const title = editing || viewing ? `User: ${userData.name}` : 'New User';
  const [user, setUser] = useState(userInitialState);
  const { errors, loading, saveUser } = useSaveUser(
    editing,
    user,
    userData ? userData.id : undefined,
    () => {
      onClose();
      showToast(
        editing ? 'User updated successfully' : 'User created successfully',
        'success'
      );
      onAction();
    },
    (message) => {
      showToast(message, 'error');
    }
  );

  useEffect(() => {
    if (userData) {
      setUser({
        ...userData,
        englishLevel: userData.englishLevel || '',
        roleId: userData.roleId || '',
      });
    } else {
      setUser(userInitialState);
    }
  }, [userData]);

  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      onAction={saveUser}
      loading={loading}
      hideActionButton={viewing}
    >
      <Form>
        <Form.Group className="mb-3" controlId="formUserName">
          <Form.Label>Name</Form.Label>
          <DisableInput
            disabled={viewing}
            type="text"
            placeholder="Enter your name"
            value={user.name}
            onChange={(e) =>
              setUser((user) => ({ ...user, name: e.target.value }))
            }
          />
          <ValidationError error={errors['name']} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUserEmail">
          <Form.Label>Email</Form.Label>
          <DisableInput
            disabled={viewing}
            type="email"
            placeholder="Enter email"
            value={user.email}
            onChange={(e) =>
              setUser((user) => ({ ...user, email: e.target.value }))
            }
          />
          <ValidationError error={errors['email']} />
        </Form.Group>

        {isNewUser ? (
          <Form.Group className="mb-3" controlId="formUserPassword">
            <Form.Label>Password</Form.Label>
            <DisableInput
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) =>
                setUser((user) => ({ ...user, password: e.target.value }))
              }
            />
            <ValidationError error={errors['password']} />
          </Form.Group>
        ) : null}

        {editing ? null : (
          <Form.Group className="mb-3" controlId="formUserRoleId">
            <Form.Label>Role</Form.Label>
            <DisableSelect
              disabled={viewing}
              placeholder="Select the role"
              value={user.roleId}
              onChange={(e) =>
                setUser((user) => ({ ...user, roleId: e.target.value }))
              }
            >
              <option value={''}>Select the role for the user</option>
              {roles.map((role) => (
                <option value={role.id} key={role.id}>
                  {role.name}
                </option>
              ))}
            </DisableSelect>
            <ValidationError error={errors['roleId']} />
          </Form.Group>
        )}

        <Form.Group className="mb-3" controlId="formUserEnglishLevel">
          <Form.Label>EnglishLevel</Form.Label>
          <DisableSelect
            disabled={viewing}
            placeholder="What is you english level?"
            value={user.englishLevel}
            onChange={(e) =>
              setUser((user) => ({ ...user, englishLevel: e.target.value }))
            }
          >
            <option value={''}>What is your english level?</option>
            {englishLevel.map((level) => (
              <option value={level} key={level}>
                {level}
              </option>
            ))}
          </DisableSelect>
          <ValidationError error={errors['englishLevel']} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUserCVLink">
          <Form.Label>CV Link</Form.Label>
          <DisableInput
            disabled={viewing}
            type="text"
            placeholder="CV Link"
            value={user.cvLink}
            onChange={(e) =>
              setUser((user) => ({
                ...user,
                cvLink: e.target.value ? e.target.value : undefined,
              }))
            }
          />
          <ValidationError error={errors['cvLink']} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUserTechnicalKnowledge">
          <Form.Label>Technical Knowledge</Form.Label>
          <DisableInput
            disabled={viewing}
            as="textarea"
            placeholder="What are your technical skills and knowledge?"
            style={{ height: '100px', resize: 'none' }}
            value={user.technicalKnowledge}
            onChange={(e) =>
              setUser((user) => ({
                ...user,
                technicalKnowledge: e.target.value,
              }))
            }
          />
          <ValidationError error={errors['technicalKnowledge']} />
        </Form.Group>
      </Form>
    </Modal>
  );
}
