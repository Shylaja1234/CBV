const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('getCart called', { userId });
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: true
      }
    });
    console.log('Cart items fetched:', cartItems);
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Failed to fetch cart', details: error.message });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    console.log('addToCart called', {
      user: req.user,
      body: req.body
    });
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      console.log('Product not found:', productId);
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId
      }
    });

    if (existingItem) {
      // Update quantity if item exists
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }
      });
      console.log('Cart item updated:', updatedItem);
      return res.json(updatedItem);
    }

    // Create new cart item
    const newItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity
      },
      include: { product: true }
    });
    console.log('Cart item created:', newItem);
    res.json(newItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart', details: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    console.log('updateCartItem called', { userId, cartItemId, quantity });
    const updatedItem = await prisma.cartItem.update({
      where: {
        id: parseInt(cartItemId),
        userId // Ensure user owns this cart item
      },
      data: { quantity },
      include: { product: true }
    });
    console.log('Cart item updated:', updatedItem);
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ error: 'Failed to update cart item', details: error.message });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { cartItemId } = req.params;
    console.log('removeFromCart called', { userId, cartItemId });
    await prisma.cartItem.delete({
      where: {
        id: parseInt(cartItemId),
        userId // Ensure user owns this cart item
      }
    });
    console.log('Cart item removed:', cartItemId);
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Failed to remove item from cart', details: error.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('clearCart called', { userId });
    await prisma.cartItem.deleteMany({
      where: { userId }
    });
    console.log('Cart cleared for user:', userId);
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart', details: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
}; 