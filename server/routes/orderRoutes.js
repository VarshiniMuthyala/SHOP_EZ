import express from 'express';
import {
  createOrder,
  getOrderById,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect); // Protect all order routes

router.post('/', createOrder);
router.get('/:id', getOrderById);

export default router;
