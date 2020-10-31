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

  const [paymentMethod, setPaymentMethod] = useState(cart.paymentMethod || 'paypal');

  useEffect(() => {
    if (!address || !city || !postalCode || !country) history.push('/shipping');
  }, [cart.shippingAddress]);

  useEffect(() => {
    dispatch(savePaymentMethod(paymentMethod));
  }, [paymentMethod]);

  const submitHandler = (e) => {
    e.preventDefault();
    history.push('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 setp3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address'>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Form.Check
            type='radio'
            value='paypal'
            label='PayPal or Credit Card'
            id='paypal'
            name='paymentMethod'
            checked={paymentMethod === 'paypal'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

          <Form.Check
            type='radio'
            value='stripe'
            label='Stripe'
            id='stripe'
            name='paymentMethod'
            checked={paymentMethod === 'stripe'}
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
