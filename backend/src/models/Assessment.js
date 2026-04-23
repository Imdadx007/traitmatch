import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['started', 'in_progress', 'completed'],
      default: 'started',
    },
    assessment_type: {
      type: String,
      enum: ['big_five', 'quick_assessment', 'premium_assessment'],
      default: 'big_five',
    },
    // Big Five Personality Traits Scores (0-100)
    scores: {
      openness: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      conscientiousness: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      extraversion: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      agreeableness: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      neuroticism: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
    },
    // Detailed answers to all questions
    answers: {
      type: Map,
      of: {
        question_id: String,
        question_text: String,
        answer: mongoose.Schema.Types.Mixed,
      },
      default: new Map(),
    },
    // User-selected career domains before taking assessment
    selected_domains: [String],
    // Assessment completion percentage
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    // Time spent on assessment (in seconds)
    duration_seconds: {
      type: Number,
      default: 0,
    },
    // Matched careers (will be populated after assessment)
    matched_careers: [
      {
        career_id: mongoose.Schema.Types.ObjectId,
        career_title: String,
        match_score: Number, // 0-100
      },
    ],
    // Whether user has saved/bookmarked results
    is_saved: {
      type: Boolean,
      default: false,
    },
    // Notes or observations
    notes: String,
  },
  { timestamps: true }
);

// Index for finding user's assessments
assessmentSchema.index({ user_id: 1, status: 1 });
assessmentSchema.index({ created_at: -1 });

export default mongoose.model('Assessment', assessmentSchema);
