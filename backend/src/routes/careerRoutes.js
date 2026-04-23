import express from 'express';
import {
  getAllCareers,
  getCareerById,
  searchCareersEndpoint,
  getCareersByDomain,
  getRecommendedCareers,
  getSimilarCareersEndpoint,
  getCareerMatch,
  getFeaturedCareers,
  getCareersStats,
  createCareer,
  updateCareer,
  deleteCareer,
} from '../controllers/careerController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getAllCareers);
router.get('/search', optionalAuth, searchCareersEndpoint);
router.get('/featured', optionalAuth, getFeaturedCareers);
router.get('/stats', getCareersStats);
router.get('/domain/:domain', optionalAuth, getCareersByDomain);
router.get('/:id', optionalAuth, getCareerById);
router.get('/:id/similar', optionalAuth, getSimilarCareersEndpoint);

// Protected routes
router.get('/recommendations/for-me', authenticate, getRecommendedCareers);
router.get('/:careerId/match', authenticate, getCareerMatch);

// Admin routes
router.post('/', authenticate, authorize('admin'), validate(schemas.createCareer), createCareer);
router.put('/:id', authenticate, authorize('admin'), updateCareer);
router.delete('/:id', authenticate, authorize('admin'), deleteCareer);

export default router;
