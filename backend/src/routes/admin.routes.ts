import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { createStaff, getStaffUsers, updateStaff, deleteStaff } from '../controllers/admin.controller';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, requireRole(['ADMIN']));

// Staff management routes
router.post('/staff', createStaff);
router.get('/staff', getStaffUsers);
router.put('/staff/:id', updateStaff);
router.delete('/staff/:id', deleteStaff);

export default router; 