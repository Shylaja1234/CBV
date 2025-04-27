import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getPricing = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;

    const pricing = await prisma.pricing.findMany({
      where: {
        productId: parseInt(productId),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(pricing);
  } catch (error) {
    console.error('Error fetching pricing:', error);
    res.status(500).json({ message: 'Error fetching pricing' });
  }
};

export const createPricing = async (req: Request, res: Response) => {
  try {
    const { productId, basePrice, discount, startDate, endDate } = req.body;

    const pricing = await prisma.pricing.create({
      data: {
        productId: parseInt(productId),
        basePrice,
        discount,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

    res.status(201).json(pricing);
  } catch (error) {
    console.error('Error creating pricing:', error);
    res.status(500).json({ message: 'Error creating pricing' });
  }
};

export const updatePricing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { basePrice, discount, startDate, endDate } = req.body;

    const pricing = await prisma.pricing.update({
      where: { id: parseInt(id) },
      data: {
        basePrice,
        discount,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    res.json(pricing);
  } catch (error) {
    console.error('Error updating pricing:', error);
    res.status(500).json({ message: 'Error updating pricing' });
  }
};

export const deletePricing = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.pricing.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Pricing deleted successfully' });
  } catch (error) {
    console.error('Error deleting pricing:', error);
    res.status(500).json({ message: 'Error deleting pricing' });
  }
}; 