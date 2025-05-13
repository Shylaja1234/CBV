const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  submitMessage,
  listMessages,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');

// Public: Submit a new message
router.post('/', submitMessage);

// Admin: List, mark as read, delete
router.get('/', authenticateToken, listMessages);
router.patch('/:id/read', authenticateToken, markAsRead);
router.delete('/:id', authenticateToken, deleteMessage);

module.exports = router; 