import express from 'express';
import {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  getFavorite,
  updateFavorite,
  isFavorited,
  getFavoritesByPriority,
  getCareerUndersConsideration,
  getFavoriteStats,
} from '../controllers/favoriteController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Favorite management
router.post('/:careerID', addFavorite);
router.delete('/:careerID', removeFavorite);
router.get('/:careerID', getFavorite);
router.get('/:careerID/is-favorited', isFavorited);
router.put('/:careerID', updateFavorite);

// Favorites list
router.get('/', getUserFavorites);
router.get('/priority/:priority', getFavoritesByPriority);
router.get('/considering/list', getCareerUndersConsideration);
router.get('/stats', getFavoriteStats);

export default router;
