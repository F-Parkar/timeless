import { Row, Col, Container } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import Meta from '../components/Meta';

import { useGetProductsQuery } from '../slices/productsApiSlice';

const HomeScreen = () => {
  const { keyword, pageNumber } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber });

  return (
    <>
      <Meta />
      <Container className="fade-in mt-4">
        {keyword && (
          <Link to="/" className="btn btn-outline-primary mb-4">
            &larr; Go Back
          </Link>
        )}

        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <Loader />
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            <h1 className="mb-4 text-center"> Latest Watches</h1>
            <Row className="g-4">
              {data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>

            <div className="d-flex justify-content-center mt-4">
              <Paginate pages={data.pages} page={data.page} keyword={keyword ? keyword : ''} />
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default HomeScreen;
