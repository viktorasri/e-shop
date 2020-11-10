import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Spinner } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

import Loader from '../components/Loader';
import Message from '../components/Message';
import { getOrders } from '../actions/orderActions';

const OrderListScreen = ({ history }) => {
  const dispatch = useDispatch();
  const [orderID, setOrderID] = useState(null);

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(getOrders());
    } else {
      history.push('/login');
    }
  }, [dispatch, userInfo, history]);

  const addDecimals = (number) => {
    return (Math.round(number * 100) / 100).toFixed(2);
  };

  return (
    <>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATA</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7}>Orders list is empty</td>
              </tr>
            )}
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user.name}</td>
                <td>{order.createdAt.slice(0, 10)}</td>
                <td>{addDecimals(order.totalPrice)}</td>
                <td>
                  {!order.isPayed ? (
                    <p>
                      <i className='fas fa-times' style={{ color: 'red' }} /> Not payed yet
                    </p>
                  ) : (
                    <p>
                      <i className='fas fa-check' style={{ color: 'green' }} /> {order.payedAt.slice(0, 10)}
                    </p>
                  )}
                </td>
                <td>
                  {!order.isDelivered ? (
                    <p>
                      <i className='fas fa-times' style={{ color: 'red' }} /> Not delivered yet
                    </p>
                  ) : (
                    <p>
                      <i className='fas fa-check' style={{ color: 'green' }} /> {order.deliveredAt.slice(0, 10)}
                    </p>
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
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
