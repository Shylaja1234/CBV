import cors from 'cors';
import { CorsOptions } from 'cors';

const ALLOWED_ORIGINS = [
  'http://localhost:8080', // Development frontend
  'http://localhost:3000', // Alternative development port
  'http://localhost:5173', // Vite default port
  process.env.FRONTEND_URL, // Production frontend URL
].filter(Boolean) as string[]; // Cast to string[] after filtering out undefined values

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) {
      console.log('Request with no origin');
      callback(null, true);
      return;
    }

    console.log('Request origin:', origin);
    console.log('Allowed origins:', ALLOWED_ORIGINS);

    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Credentials',
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400, // 24 hours in seconds
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export const corsMiddleware = cors(corsOptions); 