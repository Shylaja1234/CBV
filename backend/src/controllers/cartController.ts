import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Get user's cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true }
    });
    res.json(cartItems);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch cart', details: error.message });
  }
};

// Add item to cart
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { productId, quantity } = req.body;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const existingItem = await prisma.cartItem.findFirst({ where: { userId, productId } });
    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }
      });
      return res.json(updatedItem);
    }
    const newItem = await prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: { product: true }
    });
    res.json(newItem);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add item to cart', details: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    const updatedItem = await prisma.cartItem.update({
      where: { id: parseInt(cartItemId), userId },
      data: { quantity },
      include: { product: true }
    });
    res.json(updatedItem);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update cart item', details: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const { cartItemId } = req.params;
    await prisma.cartItem.delete({ where: { id: parseInt(cartItemId), userId } });
    res.json({ message: 'Item removed from cart' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to remove item from cart', details: error.message });
  }
};

// Clear cart
export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    await prisma.cartItem.deleteMany({ where: { userId } });
    res.json({ message: 'Cart cleared' });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to clear cart', details: error.message });
  }
}; 