import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';

import authRoutes from './routes/auth.routes.js';
import adminBookRoutes from './routes/admin.routes.js';
import userBookRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

const allowlist = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',').map((url) => url.trim()) : []),
].filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowlist.includes(origin);

    if (isAllowed) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the BookHub API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin/books', adminBookRoutes);
app.use('/api/books', userBookRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  console.error('Global error:', err.message);
  if (res.headersSent) return next(err);
  return res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error',
  });
});

// Connect to MongoDB
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Successfully connected to MongoDB!'))
    .catch((err) => console.error('MongoDB connection failed:', err.message));
} else {
  console.error('MONGO_URI is required');
}

// Export the Express API for Vercel
export default app;

// Start the server if running locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}