import Career from '../models/Career.js';
import {
  getCareerRecommendations,
  filterCareersByDomain,
  searchCareers,
  getCareerDetails,
  getSimilarCareers,
  calculateCareerMatch,
} from '../services/careerMatching.js';
import { sendSuccess, sendError, getPaginationParams, buildPaginationResponse } from '../utils/response.js';
import { ERROR_MESSAGES } from '../config/constants.js';

// Get all careers with pagination
export const getAllCareers = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);
    const { domain, search } = req.query;

    let query = { is_active: true };

    if (domain) {
      query.domain = domain;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const careers = await Career.find(query)
      .skip(skip)
      .limit(limit)
      .select('-answers -matched_careers');

    const total = await Career.countDocuments(query);

    const response = buildPaginationResponse(careers, total, page, limit);
    sendSuccess(res, 'Careers retrieved', response);
  } catch (error) {
    console.error('Error fetching careers:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get single career with details
export const getCareerById = async (req, res) => {
  try {
    const { id } = req.params;

    const career = await getCareerDetails(id);

    if (!career) {
      return sendError(res, ERROR_MESSAGES.NOT_FOUND, null, 404);
    }

    // Increment views
    await Career.findByIdAndUpdate(id, { $inc: { views_count: 1 } });

    sendSuccess(res, 'Career retrieved', career);
  } catch (error) {
    console.error('Error fetching career:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Search careers
export const searchCareersEndpoint = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;

    if (!q) {
      return sendError(res, 'Search query is required', null, 400);
    }

    const careers = await searchCareers(q, Math.min(limit, 100));
    sendSuccess(res, 'Search results retrieved', careers);
  } catch (error) {
    console.error('Error searching careers:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get careers by domain
export const getCareersByDomain = async (req, res) => {
  try {
    const { domain } = req.params;
    const { limit = 20 } = req.query;

    const careers = await filterCareersByDomain([domain], Math.min(limit, 100));

    if (!careers.length) {
      return sendSuccess(res, 'No careers found in this domain', []);
    }

    sendSuccess(res, 'Careers retrieved by domain', careers);
  } catch (error) {
    console.error('Error fetching careers by domain:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get recommended careers for authenticated user
export const getRecommendedCareers = async (req, res) => {
  try {
    if (!req.user) {
      return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, null, 401);
    }

    const { limit = 10 } = req.query;

    // Get user's latest completed assessment
    const Assessment = (await import('../models/Assessment.js')).default;
    const assessment = await Assessment.findOne({
      user_id: req.user._id,
      status: 'completed',
    }).sort({ created_at: -1 });

    if (!assessment || !assessment.scores.openness) {
      return sendError(res, 'No completed assessment found. Please complete an assessment first.', null, 404);
    }

    const recommendations = await getCareerRecommendations(assessment, Math.min(limit, 50));
    sendSuccess(res, 'Career recommendations retrieved', recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get similar careers
export const getSimilarCareersEndpoint = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    const similarCareers = await getSimilarCareers(id, Math.min(limit, 20));

    if (!similarCareers.length) {
      return sendSuccess(res, 'No similar careers found', []);
    }

    sendSuccess(res, 'Similar careers retrieved', similarCareers);
  } catch (error) {
    console.error('Error fetching similar careers:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get career match for authenticated user
export const getCareerMatch = async (req, res) => {
  try {
    if (!req.user) {
      return sendError(res, ERROR_MESSAGES.UNAUTHORIZED, null, 401);
    }

    const { careerId } = req.params;

    // Get user's latest assessment
    const Assessment = (await import('../models/Assessment.js')).default;
    const assessment = await Assessment.findOne({
      user_id: req.user._id,
      status: 'completed',
    }).sort({ created_at: -1 });

    if (!assessment) {
      return sendError(res, 'No completed assessment found', null, 404);
    }

    const career = await Career.findById(careerId);

    if (!career) {
      return sendError(res, ERROR_MESSAGES.NOT_FOUND, null, 404);
    }

    const matchScore = calculateCareerMatch(assessment.scores, career.trait_requirements);

    sendSuccess(res, 'Career match calculated', {
      career_id: careerId,
      career_title: career.title,
      match_score: matchScore,
      user_traits: assessment.scores,
      career_traits: career.trait_requirements,
    });
  } catch (error) {
    console.error('Error calculating career match:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get featured careers
export const getFeaturedCareers = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const careers = await Career.find({ is_featured: true, is_active: true })
      .limit(Math.min(limit, 50))
      .select('-answers');

    sendSuccess(res, 'Featured careers retrieved', careers);
  } catch (error) {
    console.error('Error fetching featured careers:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get career statistics
export const getCareersStats = async (req, res) => {
  try {
    const totalCareers = await Career.countDocuments({ is_active: true });
    const domains = await Career.distinct('domain', { is_active: true });

    const careersByDomain = await Career.aggregate([
      { $match: { is_active: true } },
      { $group: { _id: '$domain', count: { $sum: 1 } } },
    ]);

    const topCareers = await Career.find({ is_active: true })
      .sort({ favorites_count: -1, rating: -1 })
      .limit(5)
      .select('title domain favorites_count rating views_count');

    sendSuccess(res, 'Career statistics retrieved', {
      total_careers: totalCareers,
      domains,
      careers_by_domain: careersByDomain,
      top_careers: topCareers,
    });
  } catch (error) {
    console.error('Error fetching career stats:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Create career (admin only)
export const createCareer = async (req, res) => {
  try {
    const careerData = req.validatedBody;

    const career = new Career(careerData);
    await career.save();

    sendSuccess(res, 'Career created successfully', career, 201);
  } catch (error) {
    console.error('Error creating career:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Update career (admin only)
export const updateCareer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.validatedBody;

    const career = await Career.findByIdAndUpdate(id, updates, { new: true });

    if (!career) {
      return sendError(res, ERROR_MESSAGES.NOT_FOUND, null, 404);
    }

    sendSuccess(res, 'Career updated successfully', career);
  } catch (error) {
    console.error('Error updating career:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Delete career (admin only)
export const deleteCareer = async (req, res) => {
  try {
    const { id } = req.params;

    const career = await Career.findByIdAndDelete(id);

    if (!career) {
      return sendError(res, ERROR_MESSAGES.NOT_FOUND, null, 404);
    }

    sendSuccess(res, 'Career deleted successfully');
  } catch (error) {
    console.error('Error deleting career:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};
