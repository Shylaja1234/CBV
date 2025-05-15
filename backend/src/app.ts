import express from 'express';
import { corsMiddleware } from './middleware/cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import staffRoutes from './routes/staff.routes';
import categoryRoutes from './routes/category.routes';
import publicRoutes from './routes/public.routes';
import orderRoutes from './routes/order.routes';
import cartRoutes from './routes/cartRoutes';
import messageRoutes from './routes/messageRoutes';

dotenv.config();

const app = express();

// Apply CORS middleware before any routes
app.use(corsMiddleware);

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', publicRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/messages', messageRoutes);

// Debug route to list all registered routes
app.get('/debug/routes', (req, res) => {
  res.json(app._router.stack
    .filter((r: any) => r.route)
    .map((r: any) => ({
      path: r.route.path,
      methods: r.route.methods
    }))
  );
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT); 