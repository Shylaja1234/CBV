import { Router } from 'express';
import OrderController from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All order routes require authentication
router.use(authenticateToken);

// Get all orders for the logged-in user
router.get('/user', (req, res) => OrderController.getUserOrders(req, res));

// Get details for a specific order
router.get('/:id', (req, res) => OrderController.getOrderById(req, res));

// Razorpay payment endpoints
router.post('/create-razorpay-order', (req, res) => OrderController.createRazorpayOrder(req, res));
router.post('/checkout', (req, res) => OrderController.checkout(req, res));

export default router; 