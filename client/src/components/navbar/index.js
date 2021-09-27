import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { useAuth } from '../../hooks';

export default function NavBar() {
  const { user, logOut } = useAuth();
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Link className="navbar-brand" to="/home">
            {user.name}
          </Link>
          <Nav className="me-auto">
            <Link className="nav-link" to="/home">
              Home
            </Link>
            <Link className="nav-link" to="/Users">
              Users
            </Link>
            <Link className="nav-link" to="/Accounts">
              Accounts
            </Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={logOut}>Log Out</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}