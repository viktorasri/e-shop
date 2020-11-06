import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';

//  @desc   Place an order products
//  @route  POST /api/orders
//  @access Private
const addOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;

  if (orderItems && orderItems.lenght === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createOrder = await order.save();
    res.status(201).json(createOrder);
  }
});

//  @desc   Get order by id
//  @route  GET /api/orders/:id
//  @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.status(200);
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//  @desc   Update order to payed
//  @route  PUT /api/orders/:id/pay
//  @access Private
const updateOrderToPayed = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPayed = true;
    order.payedAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

//  @desc   Get logged user orders list
//  @route  GET /api/orders/myorders
//  @access Private
const getMyOrdersList = asyncHandler(async (req, res) => {
  const order = await Order.find({ user: req.user._id });
  res.json(order);
});

export { addOrder, getOrderById, updateOrderToPayed, getMyOrdersList };