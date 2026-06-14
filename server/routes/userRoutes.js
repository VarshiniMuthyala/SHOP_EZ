import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getUserOrders,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/orders', protect, getUserOrders);

export default router;
