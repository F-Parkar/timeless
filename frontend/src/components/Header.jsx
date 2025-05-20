import { useNavigate } from 'react-router-dom';
import { Badge, Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import logo from '../assets/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';
import { resetCart } from '../slices/cartSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logOutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logOutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <header>
      <Navbar 
        bg="primary" 
        variant="dark" 
        expand="lg" 
        collapseOnSelect 
        className="shadow-sm py-2"
      >
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand className="d-flex align-items-center">
              <div className="brand-logo-container me-2">
                <img
                  src={logo}
                  alt="Watch Shop Logo"
                  className="brand-logo"
                  style={{ width: '42px', height: '42px', objectFit: 'contain' }}
                />
              </div>
              <span className="brand-name fw-bold">Timeless</span>
            </Navbar.Brand>
          </LinkContainer>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center">
              <div className="search-container me-3 my-2 my-lg-0">
                <SearchBox />
              </div>
              
              <LinkContainer to="/cart">
                <Nav.Link className="nav-item-link d-flex align-items-center">
                  <div className="cart-icon-container me-1 position-relative">
                    <FaShoppingCart size={18} />
                    {cartItems.length > 0 && (
                      <Badge 
                        pill 
                        bg="white" 
                        className="cart-badge position-absolute border border-dark"
                      >
                        {cartItems.reduce((acc, current) => acc + current.qty, 0)}
                      </Badge>
                    )}
                  </div>
                  <span className="ms-1">Cart</span>
                </Nav.Link>
              </LinkContainer>
              
              {userInfo ? (
                <NavDropdown 
                  title={
                    <span className="user-dropdown d-inline-flex align-items-center gap-1">
                      <FaUser size={16} />
                      <span className="whitespace-nowrap">{userInfo.name}</span>
                    </span>
                  } 
                  id="username" 
                  className="nav-dropdown"
                >
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                    <LinkContainer to="/login">
                      <Nav.Link className="signin-link">
                        <FaUser size={16} className="me-1" />
                        <span>Sign In</span>
                      </Nav.Link>
                    </LinkContainer>

              )}
              
              {userInfo && userInfo.isAdmin && (
                  <NavDropdown 
                    title={
                      <span className="admin-dropdown d-inline-flex align-items-center gap-1">
                        <FaUser size={16} />
                        <span className="whitespace-nowrap">Admin</span>
                      </span>
                    } 
                    id="adminmenu" 
                    className="nav-dropdown ms-2"
                  >
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/reportlist">
                    <NavDropdown.Item>Request Reports</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;