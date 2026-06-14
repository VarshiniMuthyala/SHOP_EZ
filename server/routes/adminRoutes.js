import express from 'express';
import {
  getAdminConfig,
  updateAdminConfig,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public route to fetch banners and categories on the homepage
router.get('/config', getAdminConfig);

// Protected Admin-only routes
router.use(protect, admin);

router.put('/config', updateAdminConfig);
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/stats', getDashboardStats);

export default router;
