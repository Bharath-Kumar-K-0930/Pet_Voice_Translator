import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import User from './models/User.js';
import { productSeed } from './utils/productSeed.js';
import { userSeed } from './utils/userSeed.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');

    await User.deleteMany({});
    console.log('Cleared existing users');

    // Seed products
    const createdProducts = await Product.insertMany(productSeed);
    console.log(`Seeded ${createdProducts.length} products`);

    // Seed users
    const createdUsers = await User.insertMany(userSeed);
    console.log(`Seeded ${createdUsers.length} users`);

    console.log('Database seeding complete');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
