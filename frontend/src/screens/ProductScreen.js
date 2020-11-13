import React, { useState, useEffect } from 'react';
import { Row, Col, ListGroup, Image, Card, Button, Form, Spinner } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { listProductDetails, getProductReviews, createProductReview } from '../actions/productActions';
import Rating from '../components/Rating';
import Loading from '../components/Loader';
import Message from '../components/Message';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constans/productConstants';

const ProductScreen = ({ match }) => {
  const [qty, setQty] = useState(1);
  const [reviewFormVisible, setReviewFormVisible] = useState(false);
  const [rating, setRating] = useState('');
  const [comment, setComment] = useState('');

  const dispatch = useDispatch();
  const history = useHistory();

  const productDetails = useSelector((state) => state.productDetails);
  const { product, error, loading } = productDetails;

  const productReview = useSelector((state) => state.productReview);
  const { reviews, success: reviewsLoaded, error: errorReview, loading: loadingReview } = productReview;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { success: successReviewCreate, error: errorReviewCreate, loading: loadingReviewCreate } = productReviewCreate;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
    dispatch(listProductDetails(match.params.id));
    dispatch(getProductReviews(match.params.id));
  }, [match, dispatch, successReviewCreate]);

  useEffect(() => {
    if (userInfo && reviewsLoaded) {
      const userReviewedItem = reviews.find((r) => r.user._id === userInfo._id);
      if (reviews.length === 0 || !userReviewedItem) {
        setReviewFormVisible(true);
      } else {
        setReviewFormVisible(false);
      }
    }
  }, [userInfo, reviewsLoaded, reviews]);

  const addToCartHandler = (e) => {
    e.preventDefault();
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const reviewSubmitHandler = (e) => {
    e.preventDefault();
    const review = {
      rating,
      comment,
    };
    dispatch(createProductReview(match.params.id, review));
  };

  return (
    <>
      <Link to='/'>
        <Button className='btn btn-light my-3'>Go Back</Button>
      </Link>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant={'flush'}>
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Rating value={product.rating || 0} text={`${product.numReviews || ''} reviews`} />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>Description: {product.description}</ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={3}>
              <Card>
                <ListGroup variant='flush'>
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>
                        <strong>{product.countInStock > 0 ? 'In stock' : 'Out of Stock'}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty:</Col>
                        <Col>
                          <Form.Control as='select' value={qty} onChange={(e) => setQty(e.target.value)}>
                            {[...Array(product.countInStock).keys()].map((opt) => (
                              <option key={opt + 1} value={opt + 1}>
                                {opt + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      onClick={addToCartHandler}
                      className='btn-block'
                      type='button'
                      disabled={product.countInStock === 0}>
                      Add to Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className='mt-5'>
            <Col md={6}>
              <h2>Reviews</h2>
              {errorReview && <Message variant='danger'>{errorReview}</Message>}
              <ListGroup variant='flush'>
                {loadingReview ? (
                  <Spinner />
                ) : reviews.length ? (
                  reviews.map((review) => (
                    <ListGroup.Item key={review._id}>
                      <strong>{review.user.name}</strong>
                      <Rating
                        value={review.rating || 0}
                        text={` on ${new Date(review.createdAt).toLocaleDateString()}`}
                      />
                      <p>{review.comment}</p>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>
                    <Message>There is no reviews, be the first one!</Message>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Col>
          </Row>
          {userInfo && (
            <Row className='mt-3'>
              <Col md={6}>
                <h3 className='mb-4'>Write a customer review?</h3>
                {errorReviewCreate && <Message variant='danger'>{errorReviewCreate}</Message>}
                {reviewFormVisible ? (
                  <Form onSubmit={reviewSubmitHandler}>
                    <Form.Group controlId='rating'>
                      <Form.Label>Rating</Form.Label>
                      <Form.Control as='select' required value={rating} onChange={(e) => setRating(e.target.value)}>
                        <option value=''>Select</option>
                        <option value='1'>1 - Poor</option>
                        <option value='2'>2 - Fair</option>
                        <option value='3'>3 - Good</option>
                        <option value='4'>4 - Very good</option>
                        <option value='5'>5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as='textarea'
                        row={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </Form.Group>
                    <Button type='submit' disabled={loadingReviewCreate}>
                      {loadingReviewCreate && (
                        <>
                          <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />{' '}
                        </>
                      )}
                      Submit Review
                    </Button>
                  </Form>
                ) : (
                  <Message>Product already reviewed!</Message>
                )}
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default ProductScreen;
