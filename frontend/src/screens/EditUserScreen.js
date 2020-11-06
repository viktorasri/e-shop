import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Form, Button } from 'react-bootstrap';

import Message from '../components/Message';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { getUserDetails, updateUser } from '../actions/userActions';
import { USER_UPDATE_RESET } from '../constans/userConstants';

const EditUserScreen = ({ history, match }) => {
  const userID = match.params.id;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const dispatch = useDispatch();

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdate = useSelector((state) => state.userUpdate);
  const { error: errorUpdate, loading: loadingUpdate, success: successUpdate } = userUpdate;

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: USER_UPDATE_RESET });
      history.push('/admin/userslist');
    }
  }, [successUpdate, history]);

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (!user || user._id !== userID) {
        dispatch(getUserDetails(userID));
      } else {
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      }
    } else {
      history.push('/login');
    }
  }, [dispatch, user, userInfo, history, userID]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser({ _id: user._id, email, name, isAdmin }));
  };

  return (
    <>
      <LinkContainer to={'/admin/userslist'}>
        <Button className='btn-light'>Go Back</Button>
      </LinkContainer>
      <FormContainer>
        <h1>Edit User Profile</h1>
        {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
        {loadingUpdate && <Loader />}
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

            <Form.Group controlId='email'>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type='email'
                value={email}
                placeholder='Enter email'
                onChange={(e) => setEmail(e.target.value)}></Form.Control>
            </Form.Group>

            <Form.Group controlId='isAdmin'>
              <Form.Check
                type='checkbox'
                label='Is Admin?'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}></Form.Check>
            </Form.Group>

            <Button type='submit' variant='primary'>
              Update User
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default EditUserScreen;
