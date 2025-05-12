import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, sortBy, priceRange, page = 1, limit = 20 } = req.query;
    const where: any = {};

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    if (priceRange) {
      const [min, max] = (priceRange as string).split(',').map(Number);
      where.price = {};
      if (!isNaN(min)) where.price.gte = min;
      if (!isNaN(max)) where.price.lte = max;
    }

    let orderBy: any = undefined;
    if (sortBy === 'price-low') orderBy = { price: 'asc' };
    if (sortBy === 'price-high') orderBy = { price: 'desc' };
    if (sortBy === 'newest') orderBy = { createdAt: 'desc' };

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        include: { pricing: true },
        skip,
        take,
      }),
      prisma.product.count({ where })
    ]);

    res.json({ data: products, total, page: Number(page), limit: Number(limit), status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products', status: 500 });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, stock, category, imageUrl } = req.body;

    // Validate required fields
    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        message: 'Missing required fields: name, price, and stock are required',
        status: 400
      });
    }

    // Validate data types
    if (typeof price !== 'number' || isNaN(price)) {
      return res.status(400).json({
        message: 'Price must be a valid number',
        status: 400
      });
    }

    if (typeof stock !== 'number' || isNaN(stock) || !Number.isInteger(stock)) {
      return res.status(400).json({
        message: 'Stock must be a valid integer',
        status: 400
      });
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        stock,
        category: category || null,
        imageUrl: imageUrl || null,
      },
    });

    // Return the created product with proper response structure
    res.status(201).json({
      data: product,
      message: 'Product created successfully',
      status: 201
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      message: 'Error creating product',
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 500
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category, imageUrl } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        price,
        stock,
        category,
        imageUrl,
      },
    });

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

export const getCategoriesFromProducts = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      where: { category: { not: null } },
    });
    // Map to array of { id, name }
    const formatted = categories
      .filter(c => c.category)
      .map(c => ({ id: c.category, name: c.category }));
    res.json(formatted);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found', status: 404 });
    }
    res.json({ data: product, status: 200 });
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    res.status(500).json({ message: 'Error fetching product', status: 500 });
  }
}; 