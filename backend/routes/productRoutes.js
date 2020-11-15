import express from 'express';
import Product from '../models/productModel.js';
import {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
} from '../controllers/productController.js';
import { createReview, getProductReviews } from '../controllers/reviewControler.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { paginate } from '../middleware/paginationMiddleware.js';

const router = express.Router();

router.route('/').get(paginate(Product), getProducts).post(protect, isAdmin, createProduct);
router.route('/:id').get(getProductById).delete(protect, isAdmin, deleteProduct).put(protect, isAdmin, updateProduct);
router.route('/:id/reviews').post(protect, createReview).get(getProductReviews);

export default router;
