import asyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';

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
//  @access Private & admin
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id }).populate('user', 'id name email');

  if (order) {
    // Check if user is authorized to get order details
    const requestUser = await User.findById(req.user._id);
    if (requestUser._id.toString() === order.user._id.toString() || requestUser.isAdmin) {
      res.status(200);
      res.json(order);
    } else {
      res.status(403);
      throw new Error('You are not authorized to view this order');
    }
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

//  @desc   Update order to payed
//  @route  PUT /api/orders/:id/pay
//  @access Private
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
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

//  @desc   Get all orders
//  @route  GET /api/orders
//  @access Private / Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

export { addOrder, getOrderById, updateOrderToPayed, updateOrderToDelivered, getMyOrdersList, getOrders };
