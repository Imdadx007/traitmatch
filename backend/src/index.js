import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import careerRoutes from './routes/careerRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ==================== SECURITY MIDDLEWARE ====================
// Set security HTTP headers
app.use(helmet());

// Data sanitization against NoSQL injection
// app.use(mongoSanitize({
//   replaceWith: '_',
// }));

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Max 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', limiter);

// ==================== BODY PARSER MIDDLEWARE ====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== LOGGING MIDDLEWARE ====================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ==================== DATABASE CONNECTION ====================
connectDB();

// ==================== HEALTH CHECK ENDPOINT ====================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Evolvify Backend is running successfully',
    timestamp: new Date().toISOString(),
  });
});

// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/favorites', favoriteRoutes);

// ==================== ROOT ENDPOINT ====================
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Evolvify API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      assessments: '/api/assessments',
      careers: '/api/careers',
      profile: '/api/profile',
      favorites: '/api/favorites',
    },
  });
});

// ==================== 404 & ERROR HANDLING ====================
app.use(notFoundHandler);
app.use(errorHandler);

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 EVOLVIFY BACKEND STARTED 🚀      ║
╚════════════════════════════════════════╝
  
  Server: http://localhost:${PORT}
  Environment: ${process.env.NODE_ENV || 'development'}
  Database: ${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/evolvify'}
  
  API Documentation:
  • Auth: http://localhost:${PORT}/api/auth
  • Assessments: http://localhost:${PORT}/api/assessments
  • Careers: http://localhost:${PORT}/api/careers
  • Profile: http://localhost:${PORT}/api/profile
  • Favorites: http://localhost:${PORT}/api/favorites
  
═════════════════════════════════════════
  `);
});

// ==================== GRACEFUL SHUTDOWN ====================
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

export default app;
