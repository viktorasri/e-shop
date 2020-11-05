import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { PayPalButton } from 'react-paypal-button-v2';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constans/orderConstants';

const OrderScreen = ({ match }) => {
  const [sdkReady, setSdkReady] = useState(false);
  const orderId = match.params.id;
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, error: errorPay, success: successPay } = orderPay;

  useEffect(() => {
    const paypalScript = async () => {
      const { data: clientID } = await axios.get('/api/config/paypal');

      const script = document.createElement('script');
      script.async = true;
      script.type = 'application/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientID}`;
      script.onload = () => {
        console.log(script, clientID);
        setSdkReady(true);
      };

      document.body.appendChild(script);
    };

    if (!order || order._id !== orderId || successPay) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch(getOrderDetails(orderId));
    }

    if (order && !order.isPayed) {
      if (!window.paypal) {
        paypalScript();
      } else {
        setSdkReady(true);
      }
    }
  }, [dispatch, order, orderId, successPay]);

  //  Calculate prices
  if (!loading && order && order.orderItems) {
    orderDetails.order.itemsPrice = order.orderItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  }

  const addDecimals = (number) => {
    return (Math.round(number * 100) / 100).toFixed(2);
  };

  const onPaymentSuccessHandler = (paymentDetails) => {
    console.log(paymentDetails);
    dispatch(payOrder(orderId, paymentDetails));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error}</Message>
  ) : (
    <>
      <Row>
        <h1>Order: {order._id}</h1>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2>Shipping Address</h2>
              <p>
                <strong>Name:</strong> {order.user.name}
                <br />
                <strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address: </strong>
                {order.shippingAddress.address},
                <br />
                {order.shippingAddress.postalCode}, {order.shippingAddress.city},
                <br />
                {order.shippingAddress.country}
              </p>

              {order.isDelivered ? (
                <Message variant='success'>Order shipped at {order.shippedAt}</Message>
              ) : (
                <Message variant='danger'>Order not delivered</Message>
              )}
            </ListGroup.Item>
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPayed ? (
                <Message variant='success'>Order payed at {order.payedAt}</Message>
              ) : (
                <Message variant='danger'>Order not payed</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length ? (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/products/${item.product}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x {item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Message>Your cart is empty</Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${addDecimals(order.itemsPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${addDecimals(order.shippingPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${addDecimals(order.taxPrice)}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${addDecimals(order.totalPrice)}</Col>
                </Row>
              </ListGroup.Item>
              {!order.isPayed && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {errorPay && <Message variant='danger'>{errorPay}</Message>}
                  {sdkReady ? (
                    <PayPalButton amount={addDecimals(order.totalPrice)} onSuccess={onPaymentSuccessHandler} />
                  ) : (
                    <Loader />
                  )}
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;
