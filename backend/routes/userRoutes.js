import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { authUser, getProfileData } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', authUser);
router.route('/profile').get(protect, getProfileData);

export default router;
