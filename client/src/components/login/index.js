import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

import { useAuth } from '../../hooks';

export default function LogInPage() {
  const { singIn, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    singIn(email, password);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#ce0002',
      }}
    >
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
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          {authError ? (
            <div>
              <hr />
              <div>{authError}, please try again</div>
              <hr />
            </div>
          ) : null}
          <div className="d-grip gap-2">
            <Button variant="danger" type="submit" style={{ width: '100%' }}>
              Log In
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
