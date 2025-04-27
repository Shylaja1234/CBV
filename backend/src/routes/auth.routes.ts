import express from 'express';
import { signup, login, changePassword, refreshToken } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/admin/login', login); // Updated admin login endpoint

// Token refresh route
router.post('/refresh', refreshToken);

// Protected routes
router.post('/change-password', authenticate, changePassword);

export default router; 