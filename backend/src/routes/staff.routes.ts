import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { 
  getProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/product.controller';
import { 
  getPricing, 
  createPricing, 
  updatePricing, 
  deletePricing 
} from '../controllers/pricing.controller';

const router = express.Router();

// Product routes
router.get('/products', authenticate, requireRole(['STAFF', 'ADMIN']), getProducts);
router.post('/products', authenticate, requireRole(['STAFF', 'ADMIN']), createProduct);
router.put('/products/:id', authenticate, requireRole(['STAFF', 'ADMIN']), updateProduct);
router.delete('/products/:id', authenticate, requireRole(['STAFF', 'ADMIN']), deleteProduct);

// Pricing routes
router.get('/pricing/:productId', authenticate, requireRole(['STAFF', 'ADMIN']), getPricing);
router.post('/pricing', authenticate, requireRole(['STAFF', 'ADMIN']), createPricing);
router.put('/pricing/:id', authenticate, requireRole(['STAFF', 'ADMIN']), updatePricing);
router.delete('/pricing/:id', authenticate, requireRole(['STAFF', 'ADMIN']), deletePricing);

export default router; 