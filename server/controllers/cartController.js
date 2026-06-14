import Cart from '../models/Cart.js';

// @desc    Get logged in user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id }).populate('productId');
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, name, quantity, size, price, image } = req.body;

  try {
    // Check if item already exists in cart with same size
    let cartItem = await Cart.findOne({
      userId: req.user._id,
      productId,
      size,
    });

    if (cartItem) {
      cartItem.quantity += Number(quantity);
      await cartItem.save();
      res.json(cartItem);
    } else {
      cartItem = new Cart({
        userId: req.user._id,
        productId,
        name,
        quantity,
        size,
        price,
        image,
      });
      const createdCartItem = await cartItem.save();
      res.status(201).json(createdCartItem);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update cart item quantity or size
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItem = async (req, res) => {
  const { quantity, size } = req.body;

  try {
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (cartItem) {
      if (quantity !== undefined) cartItem.quantity = Number(quantity);
      if (size !== undefined) cartItem.size = size;

      const updatedCartItem = await cartItem.save();
      res.json(updatedCartItem);
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (cartItem) {
      res.json({ message: 'Item removed from cart' });
    } else {
      res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear user's cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
