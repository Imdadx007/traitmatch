import Assessment from '../models/Assessment.js';
import User from '../models/User.js';
import { getCareerRecommendations } from '../services/careerMatching.js';
import { sendSuccess, sendError, getPaginationParams, buildPaginationResponse } from '../utils/response.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../config/constants.js';

// Create new assessment
export const createAssessment = async (req, res) => {
  try {
    const { assessment_type = 'big_five', selected_domains } = req.validatedBody;

    const assessment = new Assessment({
      user_id: req.user._id,
      assessment_type,
      selected_domains,
      status: 'started',
    });

    await assessment.save();

    sendSuccess(res, 'Assessment created successfully', assessment, 201);
  } catch (error) {
    console.error('Error creating assessment:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get user's assessments
export const getUserAssessments = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const assessments = await Assessment.find({ user_id: req.user._id })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Assessment.countDocuments({ user_id: req.user._id });

    const response = buildPaginationResponse(assessments, total, page, limit);
    sendSuccess(res, 'Assessments retrieved', response);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get single assessment
export const getAssessment = async (req, res) => {
  try {
    const { id } = req.params;

    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return sendError(res, ERROR_MESSAGES.NOT_FOUND, null, 404);
    }

    // Verify ownership
    if (assessment.user_id.toString() !== req.user._id.toString()) {
      return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, null, 403);
    }

    sendSuccess(res, 'Assessment retrieved', assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Update assessment (save answers/progress)
export const updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers, progress, status } = req.validatedBody;

    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return sendError(res, ERROR_MESSAGES.NOT_FOUND, null, 404);
    }

    // Verify ownership
    if (assessment.user_id.toString() !== req.user._id.toString()) {
      return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, null, 403);
    }

    // Update fields
    if (answers) {
      assessment.answers = new Map([...assessment.answers, ...Object.entries(answers)]);
    }

    if (progress !== undefined) {
      assessment.progress = progress;
    }

    if (status) {
      assessment.status = status;
    }

    assessment.updated_at = new Date();
    await assessment.save();

    sendSuccess(res, 'Assessment updated successfully', assessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Submit assessment (finalize and get recommendations)
export const submitAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { scores, answers, duration_seconds } = req.validatedBody;

    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return sendError(res, ERROR_MESSAGES.NOT_FOUND, null, 404);
    }

    // Verify ownership
    if (assessment.user_id.toString() !== req.user._id.toString()) {
      return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, null, 403);
    }

    // Update assessment
    assessment.scores = scores;
    if (answers) {
      assessment.answers = new Map([...assessment.answers, ...Object.entries(answers)]);
    }
    assessment.status = 'completed';
    assessment.progress = 100;
    assessment.duration_seconds = duration_seconds || 0;
    assessment.is_saved = true;

    // Get career recommendations
    const recommendations = await getCareerRecommendations(assessment, 10);
    assessment.matched_careers = recommendations;

    await assessment.save();

    // Update user's last assessment date and count
    await User.findByIdAndUpdate(req.user._id, {
      last_assessment_date: new Date(),
      $inc: { assessment_count: 1 },
    });

    sendSuccess(res, SUCCESS_MESSAGES.ASSESSMENT_SAVED, {
      assessment,
      recommendations,
    });
  } catch (error) {
    console.error('Error submitting assessment:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get latest assessment
export const getLatestAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.findOne({ user_id: req.user._id })
      .sort({ created_at: -1 });

    if (!assessment) {
      return sendError(res, 'No assessment found', null, 404);
    }

    sendSuccess(res, 'Latest assessment retrieved', assessment);
  } catch (error) {
    console.error('Error fetching latest assessment:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Delete assessment
export const deleteAssessment = async (req, res) => {
  try {
    const { id } = req.params;

    const assessment = await Assessment.findById(id);

    if (!assessment) {
      return sendError(res, ERROR_MESSAGES.NOT_FOUND, null, 404);
    }

    // Verify ownership
    if (assessment.user_id.toString() !== req.user._id.toString()) {
      return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, null, 403);
    }

    await Assessment.deleteOne({ _id: id });

    sendSuccess(res, 'Assessment deleted successfully');
  } catch (error) {
    console.error('Error deleting assessment:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get assessment statistics for user
export const getAssessmentStats = async (req, res) => {
  try {
    const completedCount = await Assessment.countDocuments({
      user_id: req.user._id,
      status: 'completed',
    });

    const latestAssessment = await Assessment.findOne({
      user_id: req.user._id,
      status: 'completed',
    }).sort({ created_at: -1 });

    const averageScores = await Assessment.aggregate([
      {
        $match: {
          user_id: req.user._id,
          status: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          avg_openness: { $avg: '$scores.openness' },
          avg_conscientiousness: { $avg: '$scores.conscientiousness' },
          avg_extraversion: { $avg: '$scores.extraversion' },
          avg_agreeableness: { $avg: '$scores.agreeableness' },
          avg_neuroticism: { $avg: '$scores.neuroticism' },
          avg_duration: { $avg: '$duration_seconds' },
        },
      },
    ]);

    sendSuccess(res, 'Assessment statistics retrieved', {
      total_completed: completedCount,
      latest_assessment: latestAssessment,
      average_scores: averageScores[0] || {},
    });
  } catch (error) {
    console.error('Error fetching assessment stats:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};
