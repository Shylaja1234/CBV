import { Router, Request, Response, NextFunction } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  submitMessage,
  listMessages,
  markAsRead,
  deleteMessage,
  replyToMessage
} from '../controllers/messageController';

const router = Router();

// Public: Submit a new message
router.post('/', (req: Request, res: Response, next: NextFunction) => { next(); }, submitMessage);

// Admin: List, mark as read, delete
router.get('/', authenticateToken, (req: Request, res: Response, next: NextFunction) => { next(); }, listMessages);
router.patch('/:id/read', authenticateToken, (req: Request, res: Response, next: NextFunction) => { next(); }, markAsRead);
router.delete('/:id', authenticateToken, (req: Request, res: Response, next: NextFunction) => { next(); }, deleteMessage);
router.post('/:id/reply', authenticateToken, replyToMessage);

export default router; 