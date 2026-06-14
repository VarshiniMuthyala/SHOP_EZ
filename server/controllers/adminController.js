import Admin from '../models/Admin.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get admin configurations (banner, categories)
// @route   GET /api/admin/config
// @access  Public
export const getAdminConfig = async (req, res) => {
  try {
    let config = await Admin.findOne();
    if (!config) {
      // Create default configuration if none exists
      config = await Admin.create({});
    }
    res.json(config);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin configuration
// @route   PUT /api/admin/config
// @access  Private/Admin
export const updateAdminConfig = async (req, res) => {
  const { categories, banner } = req.body;

  try {
    let config = await Admin.findOne();
    if (!config) {
      config = new Admin({});
    }

    if (categories) config.categories = categories;
    if (banner) {
      if (banner.image) config.banner.image = banner.image;
      if (banner.title) config.banner.title = banner.title;
      if (banner.subtitle) config.banner.subtitle = banner.subtitle;
    }

    const updatedConfig = await config.save();
    res.json(updatedConfig);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all orders placed by users
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'username email')
      .sort({ orderDate: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (!['Pending', 'Shipped', 'Delivered'].includes(status)) {
        return res.status(400).json({ message: 'Invalid order status' });
      }
      order.status = status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    // Calculate total revenue
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Get order status summary
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      statusBreakdown: {
        pending: pendingOrders,
        shipped: shippedOrders,
        delivered: deliveredOrders
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
