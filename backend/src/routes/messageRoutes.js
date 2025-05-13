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
router.post('/', (req, res, next) => { console.log('POST /api/messages hit'); next(); }, submitMessage);

// Admin: List, mark as read, delete
router.get('/', authenticateToken, (req, res, next) => { console.log('GET /api/messages hit'); next(); }, listMessages);
router.patch('/:id/read', authenticateToken, (req, res, next) => { console.log(`PATCH /api/messages/${req.params.id}/read hit`); next(); }, markAsRead);
router.delete('/:id', authenticateToken, (req, res, next) => { console.log(`DELETE /api/messages/${req.params.id} hit`); next(); }, deleteMessage);

module.exports = router; 