import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, Form, Button } from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateProfile } from '../actions/userActions';
import { USER_UPDATE_PROFILE_RESET } from '../constans/userConstants';

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
      <Col md={4}>
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
      <Col md={8}>
        <h2>My Orders</h2>
      </Col>
    </Row>
  );
};

export default ProfileScreen;
