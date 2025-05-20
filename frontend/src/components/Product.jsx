import '../assets/styles/pic.css'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import Rating from './Rating'

const Product = ({ product }) => {
  return (
    <Card className='my-3 p-1 rounded'>
        <Link to={`/product/${product._id}`}>
        <Card.Img src={product.image} variant='top' className="product-image" />
        </Link>

        <Card.Body>
            <Link to={`/product/${product._id}`}>
                <Card.Title as='div' className='product-title'>
                    <strong>{product.name}</strong>
                </Card.Title>
            </Link>

            <Card.Text as='div'>
                <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                />
            </Card.Text>
            
            <Card.Text as='h3'>
                ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product.price).replace(/,/g, ' ')}            
            </Card.Text>
        </Card.Body>
    </Card>
  )
}

export default Product
