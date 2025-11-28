import express from 'express';
import { getProducts, addProductSeed } from '../controllers/productController.js';
const router = express.Router();

router.get('/', getProducts);
router.post('/seed', addProductSeed); // Helper to add initial data

export default router;
