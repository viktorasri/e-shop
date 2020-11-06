import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { getUsers, removeUser } from '../actions/userActions';

const UserListScreen = ({ history }) => {
  const dispatch = useDispatch();
  const [userID, setUserID] = useState(null);
  const usersList = useSelector((state) => state.usersList);
  const { loading, error, users } = usersList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userRemove = useSelector((state) => state.userRemove);
  const { success: successRemove, loading: loadingDelete } = userRemove;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getUsers());
    } else {
      history.push('/login');
    }
  }, [dispatch, userInfo, successRemove]);

  const removeUserHandler = (id) => {
    setUserID(id);
    dispatch(removeUser(id));
  };

  return (
    <>
      <h1>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <i className='fas fa-check' style={{ color: 'green' }}></i>
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }} />
                  )}
                </td>

                <td>
                  <LinkContainer to={`/users/${user._id}/edit`}>
                    <Button variant='dark' className='btn-sm'>
                      <i className='fas fa-edit' />
                    </Button>
                  </LinkContainer>
                  <Button
                    disabled={loadingDelete}
                    variant='danger'
                    className='btn-sm'
                    onClick={() => removeUserHandler(user._id)}>
                    {loadingDelete && userID === user._id ? (
                      <Spinner as='span' animation='border' size='sm' role='status' aria-hidden='true' />
                    ) : (
                      <i className='fas fa-trash' />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserListScreen;
