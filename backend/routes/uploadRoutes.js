import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import { uploadImages } from '../middleware/uploadMiddleware.js';
import { uploadProductImage } from '../controllers/uploadControler.js';

const router = express.Router();

router.route('/').post(protect, isAdmin, uploadImages.single('image'), uploadProductImage);

export default router;
