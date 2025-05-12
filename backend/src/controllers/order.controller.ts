import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const prisma = new PrismaClient();
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export class OrderController {
  // Get all orders for the logged-in user
  async getUserOrders(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) return res.status(401).json({ message: 'Not authenticated' });
      const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { address: true }
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  }

  // Get details for a specific order
  async getOrderById(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const orderId = Number(req.params.id);
      if (!userId) return res.status(401).json({ message: 'Not authenticated' });
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { address: true }
      });
      if (!order || order.userId !== userId) return res.status(404).json({ message: 'Order not found' });
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch order details' });
    }
  }

  // Create Razorpay order
  async createRazorpayOrder(req: Request, res: Response) {
    try {
      const { amount } = req.body; // amount in paise
      const options = {
        amount,
        currency: 'INR',
        receipt: `receipt_order_${Date.now()}`,
        payment_capture: 1,
      };
      const order = await razorpay.orders.create(options);
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create Razorpay order' });
    }
  }

  // Verify payment and create order
  async checkout(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) return res.status(401).json({ message: 'Not authenticated' });
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items, total, addressId } = req.body;

      // Verify signature
      const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(razorpay_order_id + '|' + razorpay_payment_id)
        .digest('hex');
      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }

      // Decrement stock for each product
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }
        });
      }

      // Create order in DB
      const order = await prisma.order.create({
        data: {
          userId,
          items,
          total,
          status: 'PAID',
          paymentId: razorpay_payment_id,
          addressId,
        },
      });
      res.json({ message: 'Order placed successfully', order });
    } catch (error) {
      res.status(500).json({ message: 'Failed to place order' });
    }
  }
}

export default new OrderController(); 