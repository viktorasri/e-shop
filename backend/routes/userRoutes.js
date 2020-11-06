import express from 'express';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import {
  authUser,
  registerUser,
  getProfileData,
  updateProfileData,
  getUsers,
  removeUserById,
  findUserById,
  updateUserById,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, isAdmin, getUsers);
router.post('/login', authUser);
router.route('/profile').get(protect, getProfileData).put(protect, updateProfileData);
router
  .route('/:id')
  .get(protect, isAdmin, findUserById)
  .put(protect, isAdmin, updateUserById)
  .delete(protect, isAdmin, removeUserById);

export default router;
