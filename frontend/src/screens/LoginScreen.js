import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { login } from '../actions/userActions';

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, userInfo } = userLogin;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [history, redirect, userInfo]);

  const handleSignIn = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={handleSignIn}>
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

        <Button type='submit' variant='primary'>
          SIGN IN
        </Button>

        <Row className='py-3'>
          <Col>
            Do not have account yet?{' '}
            <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
};

export default LoginScreen;
