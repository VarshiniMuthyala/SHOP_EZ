import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
    default: 0, // percentage discount, e.g. 10 for 10%
  },
  stock: {
    type: Number,
    required: true,
    default: 10,
  },
  rating: {
    type: Number,
    required: true,
    default: 4.5,
  },
  reviewsCount: {
    type: Number,
    required: true,
    default: 0,
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
