import express from 'express';
import { registerUser, loginUser, seedAdminUser } from '../controllers/authController.js';
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/seed-admin', seedAdminUser);

export default router;
