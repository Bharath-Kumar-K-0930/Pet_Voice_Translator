import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { handleTranslation, getUserTranslations } from '../controllers/translateController.js';
const router = express.Router();

// Multer setup for handling file uploads in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', protect, upload.single('audio'), handleTranslation);
router.get('/history', protect, getUserTranslations);

export default router;
