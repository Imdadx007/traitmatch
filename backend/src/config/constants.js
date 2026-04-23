// Big Five Personality Traits
export const PERSONALITY_TRAITS = {
  OPENNESS: 'openness',
  CONSCIENTIOUSNESS: 'conscientiousness',
  EXTRAVERSION: 'extraversion',
  AGREEABLENESS: 'agreeableness',
  NEUROTICISM: 'neuroticism',
};

// Assessment Status
export const ASSESSMENT_STATUS = {
  STARTED: 'started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// Career Domains
export const CAREER_DOMAINS = [
  'Technology',
  'Healthcare',
  'Business & Finance',
  'Creative Arts',
  'Education',
  'Engineering',
  'Law & Government',
  'Science & Research',
];

// Career Match Thresholds (0-100)
export const MATCH_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  MODERATE: 40,
  POOR: 0,
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_EXISTS: 'Email already registered',
  USER_NOT_FOUND: 'User not found',
  UNAUTHORIZED: 'Unauthorized access',
  INVALID_TOKEN: 'Invalid or expired token',
  INVALID_INPUT: 'Invalid input data',
  SERVER_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  ASSESSMENT_SAVED: 'Assessment saved successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
};

// Role-based Access
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
};
