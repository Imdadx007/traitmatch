import Favorite from '../models/Favorite.js';
import Career from '../models/Career.js';
import { sendSuccess, sendError, getPaginationParams, buildPaginationResponse } from '../utils/response.js';
import { ERROR_MESSAGES } from '../config/constants.js';

// Add career to favorites
export const addFavorite = async (req, res) => {
  try {
    const { careerID } = req.params;
    const { notes, priority, considering } = req.body;

    // Check if career exists
    const career = await Career.findById(careerID);
    if (!career) {
      return sendError(res, ERROR_MESSAGES.NOT_FOUND, null, 404);
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user_id: req.user._id,
      career_id: careerID,
    });

    if (existingFavorite) {
      return sendError(res, 'Career is already in your favorites', null, 400);
    }

    // Create favorite
    const favorite = new Favorite({
      user_id: req.user._id,
      career_id: careerID,
      notes,
      priority: priority || 'medium',
      considering: considering || false,
    });

    await favorite.save();

    // Increment favorites count in Career
    await Career.findByIdAndUpdate(careerID, { $inc: { favorites_count: 1 } });

    sendSuccess(res, 'Career added to favorites', favorite, 201);
  } catch (error) {
    if (error.code === 11000) {
      return sendError(res, 'This career is already in your favorites', null, 400);
    }

    console.error('Error adding favorite:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Remove favorite
export const removeFavorite = async (req, res) => {
  try {
    const { careerID } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      user_id: req.user._id,
      career_id: careerID,
    });

    if (!favorite) {
      return sendError(res, ERROR_MESSAGES.NOT_FOUND, null, 404);
    }

    // Decrement favorites count in Career
    await Career.findByIdAndUpdate(careerID, { $inc: { favorites_count: -1 } });

    sendSuccess(res, 'Career removed from favorites');
  } catch (error) {
    console.error('Error removing favorite:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get user's favorites
export const getUserFavorites = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const favorites = await Favorite.find({ user_id: req.user._id })
      .populate('career_id')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Favorite.countDocuments({ user_id: req.user._id });

    const response = buildPaginationResponse(favorites, total, page, limit);
    sendSuccess(res, 'User favorites retrieved', response);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get favorite details
export const getFavorite = async (req, res) => {
  try {
    const { careerID } = req.params;

    const favorite = await Favorite.findOne({
      user_id: req.user._id,
      career_id: careerID,
    }).populate('career_id');

    if (!favorite) {
      return sendError(res, ERROR_MESSAGES.NOT_FOUND, null, 404);
    }

    sendSuccess(res, 'Favorite retrieved', favorite);
  } catch (error) {
    console.error('Error fetching favorite:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Update favorite
export const updateFavorite = async (req, res) => {
  try {
    const { careerID } = req.params;
    const { notes, priority, considering } = req.body;

    const favorite = await Favorite.findOneAndUpdate(
      {
        user_id: req.user._id,
        career_id: careerID,
      },
      {
        ...(notes !== undefined && { notes }),
        ...(priority && { priority }),
        ...(considering !== undefined && { considering }),
      },
      { new: true }
    );

    if (!favorite) {
      return sendError(res, ERROR_MESSAGES.NOT_FOUND, null, 404);
    }

    sendSuccess(res, 'Favorite updated successfully', favorite);
  } catch (error) {
    console.error('Error updating favorite:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Check if career is favorited
export const isFavorited = async (req, res) => {
  try {
    const { careerID } = req.params;

    const favorite = await Favorite.findOne({
      user_id: req.user._id,
      career_id: careerID,
    });

    sendSuccess(res, 'Favorite status checked', {
      is_favorited: !!favorite,
      favorite: favorite || null,
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get favorites by priority
export const getFavoritesByPriority = async (req, res) => {
  try {
    const { priority } = req.params;
    const { page, limit, skip } = getPaginationParams(req);

    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority)) {
      return sendError(res, 'Invalid priority level', null, 400);
    }

    const favorites = await Favorite.find({
      user_id: req.user._id,
      priority,
    })
      .populate('career_id')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Favorite.countDocuments({
      user_id: req.user._id,
      priority,
    });

    const response = buildPaginationResponse(favorites, total, page, limit);
    sendSuccess(res, `${priority} priority favorites retrieved`, response);
  } catch (error) {
    console.error('Error fetching favorites by priority:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get favorites being considered
export const getCareerUndersConsideration = async (req, res) => {
  try {
    const { page, limit, skip } = getPaginationParams(req);

    const favorites = await Favorite.find({
      user_id: req.user._id,
      considering: true,
    })
      .populate('career_id')
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Favorite.countDocuments({
      user_id: req.user._id,
      considering: true,
    });

    const response = buildPaginationResponse(favorites, total, page, limit);
    sendSuccess(res, 'Careers under consideration retrieved', response);
  } catch (error) {
    console.error('Error fetching careers under consideration:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get favorite statistics
export const getFavoriteStats = async (req, res) => {
  try {
    const totalFavorites = await Favorite.countDocuments({ user_id: req.user._id });

    const priorityStats = await Favorite.aggregate([
      { $match: { user_id: req.user._id } },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    const consideringCount = await Favorite.countDocuments({
      user_id: req.user._id,
      considering: true,
    });

    const topFavorites = await Favorite.find({ user_id: req.user._id })
      .populate('career_id', 'title domain')
      .sort({ created_at: -1 })
      .limit(5);

    sendSuccess(res, 'Favorite statistics retrieved', {
      total_favorites: totalFavorites,
      by_priority: priorityStats,
      considering_count: consideringCount,
      recent_favorites: topFavorites,
    });
  } catch (error) {
    console.error('Error fetching favorite stats:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};
