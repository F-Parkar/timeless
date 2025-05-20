import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image,  Form, Button, Card} from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice'

const CartScreen = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({...product, qty})); //its these two things because in cartSlice this is what was passed into the const item
  };

  const removeFromCartHandler = async (id) => {
    dispatch(removeFromCart(id));
  };

  const emptyCartHandler = () => {
    cartItems.forEach((item) => {
    dispatch(removeFromCart(item._id));
    });
  };


  const checkOutHandler = () => {
    navigate('/login?redirect=/shipping'); //if logged in, shipping, if not, redirect to login
  };

    const totalPrice = cartItems
    .reduce((acc, item) => acc + item.qty * item.price, 0)
    .toFixed(2);

    const formattedTotalPrice = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    }).format(totalPrice).replace(/,/g, ' ');


  return (
    <Row>
        <Col md={8}> { /* main coloumn take up 8 slices of the 12*/ }
            <h1 style={{marginBottom: '20px'}}>Shopping Cart</h1>
            { cartItems.length === 0 ? (
                <Message>
                    Your Cart is Empty <Link to='/'>Go back</Link>
                </Message>
            ) : (
                <ListGroup variant='flush'>
                    { cartItems.map((item) => (
                        <ListGroup.Item key={item._id}>
                        <Row className="align-items-center">
                            <Col md={2}>
                            <Image src={item.image} alt={item.name} fluid rounded />
                            </Col>

                            <Col md={3}>
                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                            <div style={{ height: '1.5rem' }}>
                                {item.countInStock <= 5 && (
                                <small className="text-danger">
                                    Only {item.countInStock} left in stock
                                </small>
                                )}
                            </div>
                            </Col>

                            <Col md={2}>${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.price).replace(/,/g, ' ')}</Col>

                            <Col md={2}>
                            <Form.Control
                                as='select'
                                value={item.qty}
                                onChange={(e) =>
                                addToCartHandler(item, Number(e.target.value))
                                }
                            >
                                {[...Array(item.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                </option>
                                ))}
                            </Form.Control>
                            </Col>

                            <Col md={2}>
                            <Button
                                type='button'
                                variant='light'
                                onClick={() => removeFromCartHandler(item._id)}
                            >
                                <FaTrash />
                            </Button>
                            </Col>
                        </Row>
                        </ListGroup.Item>

                    ))}
                 <Button 
                    type='button' 
                    variant='outline-primary'
                    className='mb-3' 
                    onClick={emptyCartHandler}
                    disabled={cartItems.length === 0}
                    >
                    Empty Cart
                </Button>   
                </ListGroup>
            )}
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>
                                Subtotal ({ cartItems.reduce((acc, item) => acc + item.qty, 0) }) items
                            </h2>
                            ${formattedTotalPrice}
                        </ListGroup.Item>
                    <ListGroup.Item 
                     type='button' 
                     className='btn-block' 
                     hidden={cartItems.length === 0}
                     onClick={checkOutHandler}>
                        <Button>
                            Proceed to Checkout
                        </Button>

                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>
    </Row>
  )
}

export default CartScreen
