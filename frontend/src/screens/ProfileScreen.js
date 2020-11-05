import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Button, Table } from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateProfile } from '../actions/userActions';
import { getMyOrdersList } from '../actions/orderActions';
import { USER_UPDATE_PROFILE_RESET } from '../constans/userConstants';
import { LinkContainer } from 'react-router-bootstrap';

const addDecimals = (number) => {
  return (Math.round(number * 100) / 100).toFixed(2);
};

const ProfileScreen = ({ history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMyOrdersList = useSelector((state) => state.orderMyOrdersList);
  const { loading: loadingMyOrders, orders, error: errorMyOrders } = orderMyOrdersList;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        dispatch(getUserDetails('profile'));
      } else {
        setEmail(user.email);
        setName(user.name);
      }
    }
  }, [history, userInfo, user, dispatch, success]);

  useEffect(() => {
    dispatch(getMyOrdersList());
  }, [userInfo, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setMessage('');
      dispatch(
        updateProfile({
          _id: user._id,
          email,
          name,
          password,
        })
      );
    } else {
      setMessage('Passwords do not match!');
    }
  };

  return (
    <Row>
      <Col md={3}>
        <Form onSubmit={handleSubmit}>
          <h2>User Profile</h2>
          {error && <Message variant='danger'>{error}</Message>}
          {message && <Message variant='danger'>{message}</Message>}
          {success && <Message variant='success'>Profile has been updated!</Message>}
          {loading && <Loader />}

          <Form.Group controlId='name'>
            <Form.Label>Your Name</Form.Label>
            <Form.Control
              type='text'
              value={name}
              placeholder='Enter name'
              onChange={(e) => setName(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId='email'>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type='email'
              value={email}
              placeholder='Enter email'
              onChange={(e) => setEmail(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId='password'>
            <Form.Label>Your password</Form.Label>
            <Form.Control
              type='password'
              value={password}
              placeholder='Enter password'
              onChange={(e) => setPassword(e.target.value)}></Form.Control>
          </Form.Group>

          <Form.Group controlId='confirmPassword'>
            <Form.Label>Your password</Form.Label>
            <Form.Control
              type='password'
              value={confirmPassword}
              placeholder='Confirm password'
              onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='btn-block mt-4'>
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingMyOrders ? (
          <Loader />
        ) : errorMyOrders ? (
          <Message variant='danger'>{errorMyOrders}</Message>
        ) : (
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.length ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>{addDecimals(order.totalPrice)}</td>
                    <td>
                      {order.isPayed ? (
                        order.payedAt.substring(0, 10)
                      ) : (
                        <i className='fas fa-times' style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        order.deliveredAt.substring(0, 10)
                      ) : (
                        <i className='fas fa-times' style={{ color: 'red' }} />
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/orders/${order._id}`}>
                        <Button variant='dark' className='btn-sm'>
                          Details
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>'Your order list is empty!'</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
