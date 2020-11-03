import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Button } from 'react-bootstrap';

import FormContainer from '../components/FormContainer';
import { savePaymentMethod } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const {
    shippingAddress: { address, city, postalCode, country },
  } = cart;
  const dispatch = useDispatch();

  const [paymentMethod, setPaymentMethod] = useState(cart.paymentMethod || 'PayPal');

  useEffect(() => {
    if (!address || !city || !postalCode || !country) history.push('/shipping');
  }, [address, city, postalCode, country, history]);

  useEffect(() => {
    dispatch(savePaymentMethod(paymentMethod));
  }, [paymentMethod, dispatch]);

  const submitHandler = (e) => {
    e.preventDefault();
    history.push('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address'>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Form.Check
            type='radio'
            value='PayPal'
            label='PayPal or Credit Card'
            id='paypal'
            name='paymentMethod'
            checked={paymentMethod === 'PayPal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

          <Form.Check
            type='radio'
            value='Stripe'
            label='Stripe'
            id='stripe'
            name='paymentMethod'
            checked={paymentMethod === 'Stripe'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </Form.Group>

        <Button type='submit' variant='primary'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
