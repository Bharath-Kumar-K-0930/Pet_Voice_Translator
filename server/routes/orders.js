import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createOrder, getUserOrders, getOrderById, updateOrderToPaid, getAllOrders, updateOrderToDelivered, deleteOrder } from '../controllers/orderController.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);
router.get('/all', protect, getAllOrders); // Admin only
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, updateOrderToDelivered); // Admin only
router.delete('/:id', protect, deleteOrder);

export default router;
