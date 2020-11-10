import express from 'express';
import { isAdmin, protect } from '../middleware/authMiddleware.js';
import {
  addOrder,
  getOrderById,
  updateOrderToPayed,
  getMyOrdersList,
  getOrders,
} from '../controllers/orderControler.js';

const router = express.Router();

router.route('/').post(protect, addOrder).get(protect, isAdmin, getOrders);
router.route('/myorders').get(protect, getMyOrdersList);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPayed);

export default router;
