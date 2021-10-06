import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import ValidationError from '../ValidationError';
import LoaderIndicator from 'react-loader-spinner';

export default function LoginForm({ onSubmit, authError, loading }) {
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      onSubmit(email, password);
    }
  };

  const validateForm = () => {
    let errors = {};

    if (!email) {
      errors = { ...errors, email: 'Email cannot be empty' };
    }

    if (!password) {
      errors = { ...errors, password: 'Password cannot be empty' };
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return false;
    }

    setErrors({});
    return true;
  };

  return (
    <div
      style={{
        padding: '20px 40px',
        top: '25%',
        backgroundColor: 'rgba(214, 212, 212, 0.3)',
        borderRadius: '15px',
      }}
    >
      <h3 style={{ fontSize: 34, textAlign: 'center' }}>Login</h3>
      <hr style={{ background: '#ce0002' }} />
      <Form
        onSubmit={handleSubmit}
        style={{ minWidth: '320px', maxWidth: '450px', margin: 'auto auto' }}
      >
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <ValidationError error={errors['email']} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <ValidationError error={errors['password']} />
        </Form.Group>
        {authError ? (
          <div>
            <hr />
            <div>{authError}, please try again</div>
            <hr />
          </div>
        ) : null}
        <div className="d-grip gap-2">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <LoaderIndicator type="Oval" height={40} color="#ce0002" />
            </div>
          ) : (
            <Button variant="danger" type="submit" style={{ width: '100%' }}>
              Log In
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
