import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const userController = new UserController();

// Protected routes (require authentication)
router.use(authenticateToken);

// Get user profile
router.get('/profile', (req, res) => userController.getProfile(req, res));

// Update user profile
router.put('/profile', (req, res) => userController.updateProfile(req, res));

// Change password
router.put('/change-password', (req, res) => userController.changePassword(req, res));

// Address management
router.get('/addresses', (req, res) => userController.getAddresses(req, res));
router.post('/addresses', (req, res) => userController.addAddress(req, res));
router.put('/addresses/:id', (req, res) => userController.updateAddress(req, res));
router.delete('/addresses/:id', (req, res) => userController.deleteAddress(req, res));

export default router; 