import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findUserById } from '../services/user.service';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

// Debug helper
const debugLog = (message: string, data?: any) => {
  // console.log('[Auth Middleware Debug]', message, data || '');
};

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    debugLog('Checking authorization header');
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    debugLog('Token extracted from header');

    debugLog('Attempting to verify token');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
    debugLog('Token verified successfully', decoded);

    // Find user in database
    const user = await findUserById(decoded.userId);
    if (!user) {
      debugLog('User not found in database');
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    // Add user info to request
    (req as any).user = {
      id: user.id,
      role: user.role
    };
    debugLog('User added to request:', (req as any).user);

    next();
  } catch (error) {
    debugLog('Token verification failed:', error);
    return res.status(401).json({ message: 'Invalid token payload' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}; 