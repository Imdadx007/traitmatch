import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../config/constants.js';

// Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, null, 404);
    }

    sendSuccess(res, 'Profile retrieved', user.getPublicData());
  } catch (error) {
    console.error('Error fetching profile:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const updateData = req.validatedBody;

    // Prevent updating sensitive fields
    delete updateData.password;
    delete updateData.role;
    delete updateData.is_verified;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, null, 404);
    }

    sendSuccess(res, SUCCESS_MESSAGES.PROFILE_UPDATED, user.getPublicData());
  } catch (error) {
    console.error('Error updating profile:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Update user preferences
export const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!preferences) {
      return sendError(res, 'Preferences data is required', null, 400);
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences },
      { new: true }
    );

    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, null, 404);
    }

    sendSuccess(res, 'Preferences updated successfully', user.preferences);
  } catch (error) {
    console.error('Error updating preferences:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 'Current password and new password are required', null, 400);
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify current password
    const isPasswordValid = await user.matchPassword(currentPassword);

    if (!isPasswordValid) {
      return sendError(res, 'Current password is incorrect', null, 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    sendSuccess(res, 'Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return sendError(res, 'Password is required to delete account', null, 400);
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');

    // Verify password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return sendError(res, 'Password is incorrect', null, 401);
    }

    // Delete user and related data
    await User.deleteOne({ _id: req.user._id });

    // Delete user's assessments
    const Assessment = (await import('../models/Assessment.js')).default;
    await Assessment.deleteMany({ user_id: req.user._id });

    // Delete user's favorites
    const Favorite = (await import('../models/Favorite.js')).default;
    await Favorite.deleteMany({ user_id: req.user._id });

    sendSuccess(res, 'Account deleted successfully');
  } catch (error) {
    console.error('Error deleting account:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get user statistics/dashboard data
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user data
    const user = await User.findById(userId);

    // Get assessment data
    const Assessment = (await import('../models/Assessment.js')).default;
    const completedAssessments = await Assessment.countDocuments({
      user_id: userId,
      status: 'completed',
    });

    const latestAssessment = await Assessment.findOne({
      user_id: userId,
      status: 'completed',
    }).sort({ created_at: -1 });

    // Get favorites data
    const Favorite = (await import('../models/Favorite.js')).default;
    const favoriteCount = await Favorite.countDocuments({ user_id: userId });

    const favoriteCareers = await Favorite.find({ user_id: userId })
      .populate('career_id', 'title domain salary')
      .limit(5);

    // Get matched careers from latest assessment
    let matchedCareers = [];
    if (latestAssessment && latestAssessment.matched_careers) {
      matchedCareers = latestAssessment.matched_careers.slice(0, 5);
    }

    sendSuccess(res, 'Dashboard data retrieved', {
      user: user.getPublicData(),
      stats: {
        total_assessments: completedAssessments,
        total_favorites: favoriteCount,
        assessment_count: user.assessment_count,
        last_assessment_date: user.last_assessment_date,
      },
      latest_assessment: latestAssessment ? {
        id: latestAssessment._id,
        scores: latestAssessment.scores,
        completed_at: latestAssessment.completed_at,
      } : null,
      favorite_careers: favoriteCareers,
      recommended_careers: matchedCareers,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Update user role (admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return sendError(res, 'User ID and role are required', null, 400);
    }

    const validRoles = ['user', 'admin', 'moderator'];
    if (!validRoles.includes(role)) {
      return sendError(res, 'Invalid role', null, 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, null, 404);
    }

    sendSuccess(res, 'User role updated successfully', user.getPublicData());
  } catch (error) {
    console.error('Error updating user role:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Update user status (admin only)
export const updateUserStatus = async (req, res) => {
  try {
    const { userId, status } = req.body;

    if (!userId || !status) {
      return sendError(res, 'User ID and status are required', null, 400);
    }

    const validStatuses = ['active', 'inactive', 'suspended'];
    if (!validStatuses.includes(status)) {
      return sendError(res, 'Invalid status', null, 400);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    );

    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, null, 404);
    }

    sendSuccess(res, 'User status updated successfully', user.getPublicData());
  } catch (error) {
    console.error('Error updating user status:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};
