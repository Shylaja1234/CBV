const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

// All cart routes require authentication
router.use(authenticateToken);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/add', addToCart);

// Update cart item quantity
router.put('/items/:cartItemId', updateCartItem);

// Remove item from cart
router.delete('/items/:cartItemId', removeFromCart);

// Clear cart
router.delete('/clear', clearCart);

module.exports = router; 