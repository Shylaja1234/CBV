import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const STAFF_EMAIL_DOMAIN = process.env.STAFF_EMAIL_DOMAIN || 'connectingbee.in';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@connectingbee.in';

// Helper function to validate email domain
const validateEmailDomain = (email: string, role: string, name: string) => {
  console.log('Validating email domain:', { email, role, name });
  
  const isCompanyEmail = email.endsWith(`@${STAFF_EMAIL_DOMAIN}`);
  const isAdminEmail = email === ADMIN_EMAIL;
  console.log('Email validation flags:', { isCompanyEmail, isAdminEmail, STAFF_EMAIL_DOMAIN, ADMIN_EMAIL });

  if (role === 'ADMIN' && !isAdminEmail) {
    console.log('Admin email validation failed: Not using admin email');
    throw new Error('Admin must use the designated admin email address');
  }

  if (role === 'STAFF') {
    if (!isCompanyEmail) {
      console.log('Staff email validation failed: Not using company domain');
      throw new Error(`Staff must use an email with @${STAFF_EMAIL_DOMAIN} domain`);
    }
    if (isAdminEmail) {
      console.log('Staff email validation failed: Using admin email');
      throw new Error('This email is reserved for admin use only');
    }
    // Validate that staff email matches their name
    const expectedEmail = `${name.toLowerCase().replace(/\s+/g, '')}@${STAFF_EMAIL_DOMAIN}`;
    console.log('Staff email format check:', { providedEmail: email, expectedEmail });
    if (email !== expectedEmail) {
      console.log('Staff email validation failed: Email does not match name format');
      throw new Error(`Staff email must be ${expectedEmail}`);
    }
  }

  if (role === 'USER' && isCompanyEmail) {
    console.log('User email validation failed: Using company domain');
    throw new Error(`Regular users cannot use @${STAFF_EMAIL_DOMAIN} domain`);
  }

  console.log('Email validation passed successfully');
};

export class UserController {
  // Get user profile
  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      console.log('Getting profile for user:', userId);

      if (!userId) {
        console.log('No user ID found in request');
        return res.status(401).json({ message: 'User ID not found in token' });
      }
      
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        console.log('User not found:', userId);
        return res.status(404).json({ message: 'User not found' });
      }

      console.log('Profile retrieved successfully:', user.id);
      res.json(user);
    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({ message: 'Failed to get user profile' });
    }
  }

  // Update user profile
  async updateProfile(req: Request, res: Response) {
    console.log('Profile update request received:', {
      userId: (req as any).user?.userId,
      body: req.body
    });

    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        console.log('No user ID found in request');
        return res.status(401).json({ message: 'User ID not found in token' });
      }

      const { name, email } = req.body;

      // Validate input
      if (!name || !email) {
        console.log('Invalid input: Missing required fields');
        return res.status(400).json({ message: 'Name and email are required' });
      }

      console.log('Fetching current user data...');
      // Get current user with role
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          role: true,
          email: true
        }
      });

      if (!currentUser) {
        console.log('User not found:', userId);
        return res.status(404).json({ message: 'User not found' });
      }
      console.log('Current user data:', currentUser);

      // Validate email domain based on role
      try {
        console.log('Starting email domain validation...');
        validateEmailDomain(email, currentUser.role, name);
      } catch (error: any) {
        console.log('Email validation failed:', error.message);
        return res.status(400).json({ message: error.message });
      }

      // Check if email is already taken by another user
      console.log('Checking for email uniqueness...');
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: userId },
        },
      });

      if (existingUser) {
        console.log('Email already taken:', email);
        return res.status(400).json({ message: 'Email is already taken' });
      }

      // Update user
      console.log('Updating user profile...');
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name, email },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      console.log('User profile updated successfully:', updatedUser);

      res.json(updatedUser);
    } catch (error: any) {
      console.error('Error in updateProfile:', {
        error: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code
      });
      res.status(500).json({ message: 'Failed to update profile', error: error.message });
    }
  }

  // Change password
  async changePassword(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'User ID not found in token' });
      }

      const { currentPassword, newPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          message: 'Current password and new password are required' 
        });
      }

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error in changePassword:', error);
      res.status(500).json({ message: 'Failed to change password' });
    }
  }

  // Address CRUD
  async getAddresses(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) return res.status(401).json({ message: 'Not authenticated' });
      const addresses = await prisma.address.findMany({ where: { userId } });
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch addresses' });
    }
  }

  async addAddress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) return res.status(401).json({ message: 'Not authenticated' });
      const { name, phone, pincode, address1, address2, city, state, country } = req.body;
      const address = await prisma.address.create({
        data: { userId, name, phone, pincode, address1, address2, city, state, country: country || 'India' }
      });
      res.status(201).json(address);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add address' });
    }
  }

  async updateAddress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const addressId = Number(req.params.id);
      if (!userId) return res.status(401).json({ message: 'Not authenticated' });
      const { name, phone, pincode, address1, address2, city, state, country } = req.body;
      const address = await prisma.address.findUnique({ where: { id: addressId } });
      if (!address || address.userId !== userId) return res.status(404).json({ message: 'Address not found' });
      const updated = await prisma.address.update({
        where: { id: addressId },
        data: { name, phone, pincode, address1, address2, city, state, country }
      });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update address' });
    }
  }

  async deleteAddress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId;
      const addressId = Number(req.params.id);
      if (!userId) return res.status(401).json({ message: 'Not authenticated' });
      const address = await prisma.address.findUnique({ where: { id: addressId } });
      if (!address || address.userId !== userId) return res.status(404).json({ message: 'Address not found' });
      await prisma.address.delete({ where: { id: addressId } });
      res.json({ message: 'Address deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete address' });
    }
  }
}

export default UserController; 