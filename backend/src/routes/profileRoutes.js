import express from 'express';
import {
  getProfile,
  updateProfile,
  updatePreferences,
  changePassword,
  deleteAccount,
  getDashboardData,
  updateUserRole,
  updateUserStatus,
} from '../controllers/profileController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// User profile
router.get('/', getProfile);
router.put('/', validate(schemas.updateProfile), updateProfile);
router.get('/dashboard', getDashboardData);

// Preferences
router.put('/preferences', updatePreferences);

// Password and account
router.post('/change-password', changePassword);
router.delete('/delete-account', deleteAccount);

// Admin routes
router.put('/admin/role', authorize('admin'), updateUserRole);
router.put('/admin/status', authorize('admin'), updateUserStatus);

export default router;
