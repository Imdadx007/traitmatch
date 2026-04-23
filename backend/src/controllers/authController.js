import User from '../models/User.js';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../config/constants.js';

// Register new user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.validatedBody;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, ERROR_MESSAGES.EMAIL_EXISTS, null, 400);
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user._id);

    // Send response
    sendSuccess(
      res,
      SUCCESS_MESSAGES.REGISTER_SUCCESS,
      {
        user: user.getPublicData(),
        accessToken,
        refreshToken,
      },
      201
    );
  } catch (error) {
    console.error('Registration error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.validatedBody;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return sendError(res, ERROR_MESSAGES.INVALID_CREDENTIALS, null, 401);
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);

    if (!isPasswordValid) {
      return sendError(res, ERROR_MESSAGES.INVALID_CREDENTIALS, null, 401);
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Generate tokens
    const { accessToken, refreshToken } = generateTokenPair(user._id);

    // Send response
    sendSuccess(res, SUCCESS_MESSAGES.LOGIN_SUCCESS, {
      user: user.getPublicData(),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Refresh access token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return sendError(res, 'Refresh token is required', null, 400);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, null, 404);
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokenPair(user._id);

    sendSuccess(res, 'Token refreshed successfully', {
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);

    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Refresh token expired. Please login again.', null, 401);
    }

    sendError(res, ERROR_MESSAGES.INVALID_TOKEN, null, 401);
  }
};

// Logout (optional - mainly for frontend to clear tokens)
export const logout = async (req, res) => {
  try {
    sendSuccess(res, 'Logout successful');
  } catch (error) {
    console.error('Logout error:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendError(res, ERROR_MESSAGES.USER_NOT_FOUND, null, 404);
    }

    sendSuccess(res, 'User data retrieved', user.getPublicData());
  } catch (error) {
    console.error('Error fetching user:', error);
    sendError(res, ERROR_MESSAGES.SERVER_ERROR, null, 500);
  }
};
