import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { register } from '../actions/userActions';

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const dispatch = useDispatch();
  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading, userInfo } = userRegister;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, redirect, userInfo]);

  const handleSignIn = (e) => {
    e.preventDefault();

    if (password === confirmPassword) {
      setMessage('');
      dispatch(register(name, email, password));
    } else {
      setMessage('Passwords do not match!');
    }
  };

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {message && <Message variant='danger'>{message}</Message>}
      {loading && <Loader />}
      <Form onSubmit={handleSignIn}>
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

        <Button type='submit' variant='primary'>
          Register
        </Button>

        <Row className='py-3'>
          <Col>
            Have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default RegisterScreen;
