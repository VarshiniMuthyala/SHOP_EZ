import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { products, shippingAddress, paymentMethod, totalAmount } = req.body;

  try {
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Check inventory and decrease stock
    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.name} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.name}. Only ${product.stock} left.` });
      }
      
      // Decrement stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create the order
    const order = new Order({
      userId: req.user._id,
      products,
      shippingAddress,
      paymentMethod,
      totalAmount,
    });

    const createdOrder = await order.save();

    // Clear user's cart after successful order placement
    await Cart.deleteMany({ userId: req.user._id });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'username email');

    if (order) {
      // Check if user is the owner or an admin
      if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
