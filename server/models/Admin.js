import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  categories: {
    type: [String],
    default: ['Mobiles', 'Laptops', 'Headphones', 'Watches'],
  },
  banner: {
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=1200',
    },
    title: {
      type: String,
      default: 'ShopEZ Electronics Store',
    },
    subtitle: {
      type: String,
      default: 'Find the best deals on smartphones, laptops, headphones, and smartwatches. Perfect for student budgets.',
    }
  }
}, {
  timestamps: true
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
