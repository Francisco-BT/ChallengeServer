import axios from 'axios';
import { useCallback, useState } from 'react';
import { Form } from 'react-bootstrap';

import Modal from '../modal';
import ValidationError from '../ValidationError';
import { api } from '../../services';
import { useRoles } from '../../hooks';

const englishLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const closeLabel = 'Close';
const actionLabel = 'Save';
export default function UserModal({
  open,
  editing,
  viewing,
  userData,
  onClose,
  onAction,
}) {
  const { roles } = useRoles();
  const title = editing || viewing ? `User ${userData.name}` : 'New User';
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
    englishLevel: undefined,
    cvLink: undefined,
    technicalKnowledge: undefined,
  });

  const saveUser = useCallback(async () => {
    let request;
    const source = axios.CancelToken.source();
    setLoading(true);
    setErrors({});

    const data = {
      ...user,
      cvLink: user.cvLink ? user.cvLink : undefined,
      englishLevel: user.englishLevel ? user.englishLevel : undefined,
      technicalKnowledge: user.technicalKnowledge
        ? user.technicalKnowledge
        : undefined,
    };

    if (editing) {
      request = api.put(`/api/v1/users/${userData.id}`, data, {
        cancelToken: source.token,
      });
    } else {
      request = api.post('/api/v1/users', data, { cancelToken: source.token });
    }
    try {
      await request;
      onClose();
      onAction();
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ message: 'Something went wrong, please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }, [editing, user, userData, onClose, onAction]);

  return (
    <Modal
      open={open}
      title={title}
      closeLabel={closeLabel}
      actionLabel={actionLabel}
      onClose={onClose}
      onAction={saveUser}
      loading={loading}
    >
      <Form>
        <Form.Group className="mb-3" controlId="formUserName">
          <Form.Label>Name</Form.Label>
          <Form.Control
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
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={user.email}
            onChange={(e) =>
              setUser((user) => ({ ...user, email: e.target.value }))
            }
          />
          <ValidationError error={errors['email']} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUserPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={user.password}
            onChange={(e) =>
              setUser((user) => ({ ...user, password: e.target.value }))
            }
          />
          <ValidationError error={errors['password']} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUserRoleId">
          <Form.Label>Role</Form.Label>
          <Form.Select
            placeholder="Select the role"
            value={user.roleId}
            onChange={(e) =>
              setUser((user) => ({ ...user, roleId: e.target.value }))
            }
          >
            <option>Select the role for the user</option>
            {roles.map((role) => (
              <option value={role.id} key={role.id}>
                {role.name}
              </option>
            ))}
          </Form.Select>
          <ValidationError error={errors['englishLevel']} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUserEnglishLevel">
          <Form.Label>EnglishLevel</Form.Label>
          <Form.Select
            placeholder="What is you english level?"
            value={user.englishLevel}
            onChange={(e) =>
              setUser((user) => ({ ...user, englishLevel: e.target.value }))
            }
          >
            <option>What is your english level?</option>
            {englishLevel.map((level) => (
              <option value={level} key={level}>
                {level}
              </option>
            ))}
          </Form.Select>
          <ValidationError error={errors['englishLevel']} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formUserCVLink">
          <Form.Label>CV Link</Form.Label>
          <Form.Control
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
          <Form.Control
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
