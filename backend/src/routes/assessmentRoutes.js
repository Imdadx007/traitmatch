import express from 'express';
import {
  createAssessment,
  getUserAssessments,
  getAssessment,
  updateAssessment,
  submitAssessment,
  getLatestAssessment,
  deleteAssessment,
  getAssessmentStats,
} from '../controllers/assessmentController.js';
import { authenticate } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Assessment CRUD
router.post('/', validate(schemas.createAssessment), createAssessment);
router.get('/', getUserAssessments);
router.get('/latest', getLatestAssessment);
router.get('/stats', getAssessmentStats);
router.get('/:id', getAssessment);
router.put('/:id', validate(schemas.updateAssessment), updateAssessment);
router.post('/:id/submit', validate(schemas.submitAssessment), submitAssessment);
router.delete('/:id', deleteAssessment);

export default router;
