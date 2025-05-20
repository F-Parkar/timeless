import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import FormContainer from '../../components/FormContainer';
import { toast } from 'react-toastify';
import { useGetProductDetailsQuery, useUpdateProductMutation, useUploadProductImageMutation } from '../../slices/productsApiSlice';


const ProductEditScreen = () => {

    const { id: productId } = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);  
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');

    const { data: product, isLoading, refetch, error} = useGetProductDetailsQuery(productId);

    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

    const navigate = useNavigate();

    //Form that has the product details
    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    // Add a submit handler (optional, for completeness)
    const submitHandler = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description,
        };

        const res = await updateProduct(updatedProduct);
        if (res.error) {
            toast.error(res.error.data.message || res.error.error);
        } else {
            toast.success('Product updated successfully');
            refetch();
            navigate('/admin/productlist');
        }
    };

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        const file = e.target.files[0]; //choose first item in the array
        formData.append('image', file); //append the image to the form data
        try {
                const res = await uploadProductImage(formData).unwrap();
                toast.success('Image uploaded successfully');
                setImage(res.image); // Cloudinary URL

        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    }

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>Go Back</Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}
                {isLoading ? (<Loader />) : error ? (
                    <Message variant='danger'>{error?.data?.message || error.error || 'Error loading product'}</Message>) 
                    : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='my-2'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter product name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='price' className='my-2'>
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter product price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='image' className='my-2'>
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter product image URL'
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            ></Form.Control>
                            <Form.Control
                                type='file'
                                label='Choose File'
                                onChange={ uploadFileHandler }>
                            </Form.Control>
                            {loadingUpload && <Loader />}
                        </Form.Group>

                        <Form.Group controlId='brand' className='my-2'>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter product brand'
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='category' className='my-2'>
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter product category'
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='countInStock' className='my-2'>
                            <Form.Label>Count In stock</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter product count in stock'
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='description' className='my-2'>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                placeholder='Enter product description'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Button type='submit' variant='primary' className='my-2'>
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    ); 
}

export default ProductEditScreen
