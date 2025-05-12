import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: number;
  email?: string;
  role: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('Auth header:', authHeader);

    if (!authHeader) {
      console.log('No authorization header found');
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('No token found in authorization header');
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    console.log('Verifying token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    console.log('Decoded token:', { ...decoded, token: '[REDACTED]' });

    if (!decoded.userId) {
      console.log('No userId in token payload');
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    // Add the decoded user to the request object
    (req as any).user = decoded;
    console.log('User added to request:', { userId: decoded.userId, role: decoded.role });
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}; 