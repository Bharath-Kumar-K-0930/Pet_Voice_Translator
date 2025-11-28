import Product from '../models/Product.js';
import { productSeed } from '../utils/productSeed.js'; // We'll create this file

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// A function to easily add sample products to your database
export const addProductSeed = async (req, res) => {
  try {
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(productSeed);
    res.status(201).json(createdProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
