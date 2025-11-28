import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getFavorites, addToFavorites, removeFromFavorites } from '../controllers/favoritesController.js';

const router = express.Router();

router.get('/', protect, getFavorites);
router.post('/add', protect, addToFavorites);
router.delete('/remove/:productId', protect, removeFromFavorites);

export default router;
