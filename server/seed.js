import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import Admin from './models/Admin.js';
import Cart from './models/Cart.js';
import Order from './models/Order.js';

dotenv.config();

const products = [
  // Mobiles
  {
    name: 'iPhone 13',
    description: '128GB storage, dual camera system, fast A15 Bionic chip, and long battery life. Perfect smartphone for daily tasks and capturing photos.',
    price: 699.00,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=600',
    discount: 10,
    stock: 15,
    rating: 4.8,
    reviewsCount: 124
  },
  {
    name: 'Samsung Galaxy S21',
    description: 'High performance Android smartphone featuring a 120Hz display, triple lens camera system, and all-day intelligent battery.',
    price: 599.99,
    category: 'Mobiles',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600',
    discount: 15,
    stock: 10,
    rating: 4.7,
    reviewsCount: 98
  },
  // Laptops
  {
    name: 'Student Laptop Pro',
    description: 'Lightweight laptop ideal for students. Features 16GB RAM, 512GB SSD, long-lasting battery, and pre-installed office software.',
    price: 899.00,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1b?q=80&w=600',
    discount: 5,
    stock: 8,
    rating: 4.9,
    reviewsCount: 45
  },
  {
    name: 'Dell Inspiron 15',
    description: 'Reliable 15.6-inch screen laptop for study and casual work. Offers AMD processor, 8GB RAM, and 256GB SSD.',
    price: 499.00,
    category: 'Laptops',
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=600',
    discount: 0,
    stock: 20,
    rating: 4.5,
    reviewsCount: 36
  },
  // Headphones
  {
    name: 'Wireless Headphones',
    description: 'Over-ear Bluetooth headphones with active noise cancellation, deep bass, and comfortable ear cushions for long study sessions.',
    price: 99.00,
    category: 'Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600',
    discount: 20,
    stock: 30,
    rating: 4.6,
    reviewsCount: 88
  },
  {
    name: 'Bluetooth Earbuds',
    description: 'True wireless in-ear sports earbuds. Sweatproof, quick charging case, clear calling microphone, and easy touch controls.',
    price: 49.00,
    category: 'Headphones',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600',
    discount: 0,
    stock: 50,
    rating: 4.3,
    reviewsCount: 112
  },
  // Watches
  {
    name: 'Smart Fitness Watch',
    description: 'Tracks heart rate, daily steps, sleep quality, and workouts. Connects to iOS & Android for notifications.',
    price: 149.00,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?q=80&w=600',
    discount: 10,
    stock: 25,
    rating: 4.7,
    reviewsCount: 74
  },
  {
    name: 'Classic Wristwatch',
    description: 'Simple and elegant analog quartz watch with a leather strap. Waterproof design suitable for everyday wear.',
    price: 79.00,
    category: 'Watches',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600',
    discount: 0,
    stock: 15,
    rating: 4.4,
    reviewsCount: 28
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/shopEZ');
    console.log('Connected to Database for seeding...');

    // Clear existing collections
    await User.deleteMany({});
    await Product.deleteMany({});
    await Admin.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing data.');

    // Seed Admin Config
    const adminConfig = await Admin.create({
      categories: ['Mobiles', 'Laptops', 'Headphones', 'Watches'],
      banner: {
        image: 'https://images.unsplash.com/photo-1468436139062-f60a71c5c892?q=80&w=1200',
        title: 'ShopEZ Electronics Store',
        subtitle: 'Find the best deals on smartphones, laptops, headphones, and smartwatches. Perfect for student budgets.',
      }
    });
    console.log('Admin configuration seeded successfully.');

    // Seed Users
    // Pre-save hook will hash the passwords automatically
    const adminUser = await User.create({
      username: 'ShopEZ Admin',
      email: 'admin@shopez.com',
      password: 'admin123', // Will be hashed by pre-save
      role: 'admin'
    });

    const sarahUser = await User.create({
      username: 'Sarah',
      email: 'sarah@shopez.com',
      password: 'sarah123', // Will be hashed by pre-save
      role: 'user'
    });
    console.log('Seed users created (admin@shopez.com / admin123, sarah@shopez.com / sarah123).');

    // Seed Products
    await Product.insertMany(products);
    console.log(`${products.length} Products seeded successfully.`);

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding database: ', error);
    process.exit(1);
  }
};

seedDB();
