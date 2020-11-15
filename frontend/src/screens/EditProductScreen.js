import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';

import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { listProductDetails, updateProduct } from '../actions/productActions';
import { PRODUCT_UPDATE_RESET, PRODUCT_DETAILS_RESET } from '../constans/productConstants';

const EditProductScreen = ({ history, match }) => {
  const productID = match.params.id;
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(null);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { error, loading, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = productUpdate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch({ type: PRODUCT_DETAILS_RESET });
      history.push('/admin/productslist');
    }
  }, [successUpdate, history, dispatch]);

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
    dispatch(updateProduct({ _id: productID, name, description, image, price, countInStock, brand, category }));
  };

  const uploadFileHandler = async (e) => {
    setFileUploadError(null);
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      setFileUploadError('Max uploaded image size 5MB');
    } else {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);

      try {
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.post('/api/uploads', formData, config);
        setImage(data);
        setUploading(false);
      } catch (error) {
        console.log(error);
        setFileUploadError(error.message);
        setUploading(false);
      }
    }
  };

  return (
    <>
      <Button onClick={() => history.goBack()} className='btn-light'>
        Go Back
      </Button>

      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
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
              <Row>
                <Col xs={6} md={4}>
                  {uploading ? <Loader /> : <Image src={image} thumbnail />}
                </Col>
                <Col md={8}>
                  <Form.Control
                    type='text'
                    value={image}
                    placeholder='Enter image'
                    disabled={uploading}
                    onChange={(e) => setImage(e.target.value)}></Form.Control>
                  <Form.File
                    disabled={uploading}
                    id='image-upload'
                    label='Upload image'
                    custom
                    accept='image/jpg, image/jpeg, image/png'
                    onChange={uploadFileHandler}
                  />
                  {fileUploadError && <Message variant='danger'>{fileUploadError}</Message>}
                </Col>
              </Row>
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
