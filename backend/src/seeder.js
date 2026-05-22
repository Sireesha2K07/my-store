const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();
const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
    await User.deleteMany();
    await Product.deleteMany();
    console.log('Old data cleared...');
    await User.create({
      name: 'Admin User',
      email: 'admin@store.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin user created...');
    await Product.insertMany([
      {
        name: 'Wireless Headphones',
        description: 'Premium sound quality with noise cancellation.',
        price: 79.99,
        category: 'Electronics',
        image: 'https://via.placeholder.com/400',
        countInStock: 50,
        rating: 4.5,
        numReviews: 12,
      },
      {
        name: 'Running Shoes',
        description: 'Lightweight and comfortable for long runs.',
        price: 129.99,
        category: 'Sports',
        image: 'https://via.placeholder.com/400',
        countInStock: 30,
        rating: 4.8,
        numReviews: 8,
      },
      {
        name: 'Coffee Maker',
        description: 'Brews perfect coffee every morning.',
        price: 59.99,
        category: 'Kitchen',
        image: 'https://via.placeholder.com/400',
        countInStock: 25,
        rating: 4.2,
        numReviews: 5,
      },
      {
        name: 'Backpack Pro',
        description: 'Durable backpack with laptop compartment.',
        price: 89.99,
        category: 'Accessories',
        image: 'https://via.placeholder.com/400',
        countInStock: 40,
        rating: 4.6,
        numReviews: 20,
      },
      {
        name: 'Smart Watch',
        description: 'Track your fitness and stay connected.',
        price: 199.99,
        category: 'Electronics',
        image: 'https://via.placeholder.com/400',
        countInStock: 15,
        rating: 4.7,
        numReviews: 30,
      },
      {
        name: 'Yoga Mat',
        description: 'Non-slip surface for all yoga styles.',
        price: 34.99,
        category: 'Sports',
        image: 'https://via.placeholder.com/400',
        countInStock: 60,
        rating: 4.4,
        numReviews: 15,
      },
    ]);
    console.log(' Sample products created!');
    console.log('Database seeded successfully!');
    console.log('----------------------------');
    console.log('Admin Email: admin@store.com');
    console.log('Admin Password: admin123');
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};
seedData();