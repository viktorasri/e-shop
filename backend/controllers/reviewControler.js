import asyncHandler from 'express-async-handler';
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';

//  @desc   Create review
//  @route  POST /api/products/:id/reviews
//  @access Private
const createReview = asyncHandler(async (req, res) => {
  const alreadyReviewed = await Review.findOne({ user: req.user._id, product: req.params.id });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Product already has review from this user');
  }

  const { rating, comment } = req.body;
  const review = new Review({
    user: req.user._id,
    product: req.params.id,
    comment,
    rating,
  });

  await review.save();

  // Update Product model with new review details
  const productReviews = await Review.find({ product: req.params.id });
  const product = await Product.findById(req.params.id);
  product.numReviews = productReviews.length || 0;
  product.rating = productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length || 0;

  await product.save();

  res.status(201).json({ message: 'Review added' });
});

//  @desc   Get product reviews
//  @route  GET /api/products/:id/reviews
//  @access Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id }).populate('user', 'id name');
  res.json(reviews);
});

export { createReview, getProductReviews };
