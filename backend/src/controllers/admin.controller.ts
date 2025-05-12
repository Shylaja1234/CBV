import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const prisma = new PrismaClient();
const STAFF_EMAIL_DOMAIN = process.env.STAFF_EMAIL_DOMAIN || 'connectingbee.in';
const DEFAULT_STAFF_PASSWORD = process.env.DEFAULT_STAFF_PASSWORD || 'password123';

// Create new staff user (only admin can do this)
export const createStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, department } = req.body;

    // Validate email domain
    if (!email.endsWith(`@${STAFF_EMAIL_DOMAIN}`)) {
      return res.status(400).json({ 
        message: `Staff email must use the @${STAFF_EMAIL_DOMAIN} domain` 
      });
    }

    // Validate that email matches staff name
    const emailPrefix = email.split('@')[0];
    const expectedEmailPrefix = name.toLowerCase().replace(/\s+/g, '');
    if (emailPrefix !== expectedEmailPrefix) {
      return res.status(400).json({ 
        message: `Staff email must be ${expectedEmailPrefix}@${STAFF_EMAIL_DOMAIN}` 
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash default password
    const hashedPassword = await bcrypt.hash(DEFAULT_STAFF_PASSWORD, 10);

    // Create staff user with ACTIVE status and isFirstLogin true
    const staff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'STAFF',
        department,
        status: 'ACTIVE',
        isFirstLogin: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        department: true,
        isFirstLogin: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(201).json({
      message: 'Staff user created successfully',
      user: staff,
    });
  } catch (error) {
    console.error('Error creating staff user:', error);
    res.status(500).json({ message: 'Error creating staff user' });
  }
};

// Get all staff users
export const getStaffUsers = async (req: Request, res: Response) => {
  try {
    const staffUsers = await prisma.user.findMany({
      where: {
        role: 'STAFF',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        department: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Format the response to match frontend types
    const formattedStaffUsers = staffUsers.map(user => ({
      ...user,
      status: user.status || 'INACTIVE',
      department: user.department || 'Not Assigned',
    }));

    res.json(formattedStaffUsers);
  } catch (error) {
    console.error('Error fetching staff users:', error);
    res.status(500).json({ message: 'Error fetching staff users' });
  }
};

// Update staff user
export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, department, status } = req.body;

    const staff = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!staff || staff.role !== 'STAFF') {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    // Generate new email based on updated name
    const newEmail = `${name.toLowerCase().replace(/\s+/g, '')}@${STAFF_EMAIL_DOMAIN}`;

    // Update user with new name, email, and other fields
    const updatedStaff = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email: newEmail, // Automatically update email based on new name
        department,
        status: status as 'ACTIVE' | 'INACTIVE',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        department: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      message: 'Staff updated successfully',
      user: updatedStaff
    });
  } catch (error) {
    console.error('Error updating staff user:', error);
    res.status(500).json({ message: 'Error updating staff user' });
  }
};

// Delete staff user
export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const staff = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!staff || staff.role !== 'STAFF') {
      return res.status(404).json({ message: 'Staff user not found' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Staff user deleted successfully' });
  } catch (error) {
    console.error('Error deleting staff user:', error);
    res.status(500).json({ message: 'Error deleting staff user' });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'USER' }, // Only users with role USER
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    // Ensure all fields are present and have defaults
    const formatted = users.map(user => ({
      ...user,
      status: user.status || 'INACTIVE',
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
    }));
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
}; 