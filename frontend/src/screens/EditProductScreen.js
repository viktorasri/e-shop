import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Form, Button } from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProductDetails } from '../actions/productActions';

const EditProductScreen = ({ history, match }) => {
  const productID = match.params.id;
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // useEffect(() => {
  //   if (successUpdate) {
  //     dispatch({ type: USER_UPDATE_RESET });
  //     history.push('/admin/userslist');
  //   }
  // }, [successUpdate, history, dispatch]);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (!product || product._id !== productID) {
        dispatch(listProductDetails(productID));
      } else {
        setName(product.name);
        setImage(product.image);
        setDescription(product.description);
        setPrice(product.price);
        setCountInStock(product.countInStock);
        setBrand(product.brand);
        setCategory(product.category);
      }
    } else {
      history.push('/login');
    }
  }, [dispatch, product, userInfo, history, productID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // UPDATE PRODUCT
  };

  return (
    <>
      <LinkContainer to={'/admin/productslist'}>
        <Button className='btn-light'>Go Back</Button>
      </LinkContainer>
      <FormContainer>
        <h1>Edit Product</h1>
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>{error}</Message>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId='name'>
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type='text'
                value={name}
                placeholder='Enter name'
                onChange={(e) => setName(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                value={description}
                placeholder='Enter description'
                onChange={(e) => setDescription(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                value={brand}
                placeholder='Enter brand'
                onChange={(e) => setBrand(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                value={category}
                placeholder='Enter category'
                onChange={(e) => setCategory(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                value={image}
                placeholder='Enter image'
                onChange={(e) => setImage(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                value={price}
                placeholder='Enter price'
                onChange={(e) => setPrice(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type='number'
                value={countInStock}
                placeholder='Enter count in stock'
                onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update Product
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default EditProductScreen;
