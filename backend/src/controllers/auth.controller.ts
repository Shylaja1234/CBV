import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { createUser, findUserByEmail } from '../services/user.service';

const prisma = new PrismaClient();
const STAFF_EMAIL_DOMAIN = process.env.STAFF_EMAIL_DOMAIN || 'connectingbee.in';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@connectingbee.in';
const JWT_SECRET: Secret = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES_IN = 86400; // 24 hours in seconds

// Debug helper
const debugLog = (message: string, data?: any) => {
  console.log(`[Auth Debug] ${message}`, data || '');
};

// Helper function to validate email domain
const validateEmailDomain = (email: string, role: string) => {
  const isCompanyEmail = email.endsWith(`@${STAFF_EMAIL_DOMAIN}`);
  const isAdminEmail = email === ADMIN_EMAIL;

  if (role === 'ADMIN' && !isAdminEmail) {
    throw new Error('Admin must use the designated admin email address');
  }

  if (role === 'STAFF') {
    if (!isCompanyEmail) {
      throw new Error(`Staff must use an email with @${STAFF_EMAIL_DOMAIN} domain`);
    }
    if (isAdminEmail) {
      throw new Error('This email is reserved for admin use only');
    }
    // Validate that staff email matches their name
    const emailPrefix = email.split('@')[0];
    if (emailPrefix !== email.split('@')[0].toLowerCase().replace(/\s+/g, '')) {
      throw new Error('Staff email must match your name (lowercase, no spaces)');
    }
  }

  if (role === 'USER' && isCompanyEmail) {
    throw new Error(`Regular users cannot use @${STAFF_EMAIL_DOMAIN} domain`);
  }
};

// Helper function to generate JWT token
const generateToken = (userId: number, role: string): string => {
  try {
    debugLog('Generating token for:', { userId, role });
    const payload = {
      userId: userId,
      role: role,
      email: null
    };
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN
    };
    const token = jwt.sign(payload, JWT_SECRET, options);
    debugLog('Token generated successfully');
    return token;
  } catch (error) {
    debugLog('Token generation failed:', error);
    throw error;
  }
};

// Add after the generateToken function
const verifyToken = (token: string): { userId: number; role: string } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    return decoded;
  } catch (error) {
    return null;
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate email domain based on role
    try {
      validateEmailDomain(email, role || 'USER');
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      role: role || 'USER'
    });

    // Generate JWT token
    const token = generateToken(user.id, user.role);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    debugLog('Login attempt for email:', email);

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      debugLog('User not found:', email);
      return res.status(401).json({ 
        message: 'Invalid credentials',
        details: 'No user found with this email'
      });
    }
    debugLog('User found:', { id: user.id, role: user.role });

    // Validate email domain based on user's role
    try {
      validateEmailDomain(email, user.role);
      debugLog('Email domain validation passed');
    } catch (error: any) {
      debugLog('Email domain validation failed:', error.message);
      return res.status(401).json({ 
        message: error.message,
        details: 'Email domain validation failed'
      });
    }

    // Special handling for admin login - always use current .env password
    if (email === ADMIN_EMAIL) {
      debugLog('Admin login attempt');
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      if (!adminPassword) {
        debugLog('ADMIN_PASSWORD not set in .env');
        return res.status(500).json({ 
          message: 'Server configuration error',
          details: 'Admin password not configured'
        });
      }

      if (password !== adminPassword) {
        debugLog('Admin password mismatch');
        return res.status(401).json({ 
          message: 'Invalid credentials',
          details: 'Admin password is incorrect'
        });
      }
      debugLog('Admin password verified');

      // Update admin password hash in database to match current .env password
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.update({
        where: { email: ADMIN_EMAIL },
        data: { password: hashedPassword }
      });
    } else {
      // For non-admin users, verify password hash
      debugLog('Verifying password for non-admin user');
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        debugLog('Password verification failed');
        return res.status(401).json({ 
          message: 'Invalid credentials',
          details: 'Password is incorrect'
        });
      }
      debugLog('Password verified successfully');
    }

    // Generate JWT token
    let token;
    try {
      token = generateToken(user.id, user.role);
      debugLog('Login token generated successfully');
    } catch (error) {
      debugLog('Token generation failed:', error);
      throw error;
    }

    // Prepare response data
    const responseData = {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin
      },
      token
    };
    debugLog('Sending successful login response:', { userId: user.id, role: user.role });

    res.json(responseData);
  } catch (error: any) {
    debugLog('Login error:', error);
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: 'Error logging in',
      details: error.message
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = (req as any).user.id;

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and set isFirstLogin to false
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        isFirstLogin: false
      }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
};

// Add the refresh token endpoint
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers['authorization'];
    debugLog('Refresh token attempt with header:', authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    // Verify the existing token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Get user from database to ensure they still exist and have same role
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
        isFirstLogin: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== decoded.role) {
      return res.status(401).json({ message: 'User role mismatch' });
    }

    // Generate new token
    const newToken = generateToken(user.id, user.role);
    debugLog('New token generated for user:', user.id);

    res.json({
      message: 'Token refreshed successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isFirstLogin: user.isFirstLogin
      },
      token: newToken
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({ message: 'Error refreshing token' });
  }
}; 