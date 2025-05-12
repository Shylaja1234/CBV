import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getProducts, getProductById } from '../controllers/product.controller';

const router = express.Router();

router.get('/products', authenticate, getProducts);
router.get('/products/:id', authenticate, getProductById);

export default router; 