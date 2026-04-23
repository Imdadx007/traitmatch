import Joi from 'joi';

// Validation middleware factory
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const messages = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages,
      });
    }

    req.validatedBody = value;
    next();
  };
};

// Validation schemas
export const schemas = {
  // Auth schemas
  register: Joi.object({
    name: Joi.string().required().min(2).max(50).trim(),
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required().min(6).max(50),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
  }),

  login: Joi.object({
    email: Joi.string().required().email().lowercase(),
    password: Joi.string().required(),
  }),

  // Profile schemas
  updateProfile: Joi.object({
    name: Joi.string().max(50).trim(),
    phone: Joi.string().allow(null),
    bio: Joi.string().max(500),
    avatar_url: Joi.string().uri().allow(null),
    preferences: Joi.object({
      theme: Joi.string().valid('light', 'dark'),
      notifications_enabled: Joi.boolean(),
      career_domains: Joi.array().items(Joi.string()),
    }),
  }),

  // Assessment schemas
  createAssessment: Joi.object({
    assessment_type: Joi.string()
      .valid('big_five', 'quick_assessment', 'premium_assessment')
      .default('big_five'),
    selected_domains: Joi.array().items(Joi.string()),
  }),

  updateAssessment: Joi.object({
    answers: Joi.object().pattern(
      Joi.string(),
      Joi.object({
        question_id: Joi.string().required(),
        question_text: Joi.string().required(),
        answer: Joi.any().required(),
      })
    ),
    progress: Joi.number().min(0).max(100),
    status: Joi.string().valid('started', 'in_progress', 'completed'),
  }),

  submitAssessment: Joi.object({
    scores: Joi.object({
      openness: Joi.number().min(0).max(100).required(),
      conscientiousness: Joi.number().min(0).max(100).required(),
      extraversion: Joi.number().min(0).max(100).required(),
      agreeableness: Joi.number().min(0).max(100).required(),
      neuroticism: Joi.number().min(0).max(100).required(),
    }).required(),
    answers: Joi.object().pattern(Joi.string(), Joi.any()),
    duration_seconds: Joi.number().min(0),
  }),

  // Career schemas
  createCareer: Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string().required(),
    short_description: Joi.string().max(200),
    domain: Joi.string()
      .required()
      .valid(
        'Technology',
        'Healthcare',
        'Business & Finance',
        'Creative Arts',
        'Education',
        'Engineering',
        'Law & Government',
        'Science & Research'
      ),
    trait_requirements: Joi.object({
      openness: Joi.number().min(0).max(100),
      conscientiousness: Joi.number().min(0).max(100),
      extraversion: Joi.number().min(0).max(100),
      agreeableness: Joi.number().min(0).max(100),
      neuroticism: Joi.number().min(0).max(100),
    }),
    salary: Joi.object({
      entry_level: Joi.number(),
      mid_career: Joi.number(),
      experienced: Joi.number(),
    }),
    skills: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        importance: Joi.string().valid('critical', 'important', 'nice_to_have'),
      })
    ),
  }),

  // Favorite schemas
  createFavorite: Joi.object({
    career_id: Joi.string().required(),
    notes: Joi.string(),
    priority: Joi.string().valid('low', 'medium', 'high'),
    considering: Joi.boolean(),
  }),
};
