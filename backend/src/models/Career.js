import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Career title is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Career description is required'],
    },
    short_description: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    domain: {
      type: String,
      required: true,
      enum: [
        'Technology',
        'Healthcare',
        'Business & Finance',
        'Creative Arts',
        'Education',
        'Engineering',
        'Law & Government',
        'Science & Research',
      ],
    },
    // Big Five Trait Requirements for this career (0-100)
    // High value = important for this career
    trait_requirements: {
      openness: { type: Number, min: 0, max: 100, default: 50 },
      conscientiousness: { type: Number, min: 0, max: 100, default: 50 },
      extraversion: { type: Number, min: 0, max: 100, default: 50 },
      agreeableness: { type: Number, min: 0, max: 100, default: 50 },
      neuroticism: { type: Number, min: 0, max: 100, default: 50 },
    },
    // Salary Information
    salary: {
      entry_level: Number, // USD
      mid_career: Number,
      experienced: Number,
      currency: { type: String, default: 'USD' },
    },
    // Job Market Information
    job_outlook: {
      growth_rate: Number, // percentage per year
      demand_level: {
        type: String,
        enum: ['very_low', 'low', 'moderate', 'high', 'very_high'],
      },
      available_jobs: Number,
    },
    // Skills Required
    skills: [
      {
        name: String,
        importance: { type: String, enum: ['critical', 'important', 'nice_to_have'] },
      },
    ],
    // Education Requirements
    education: {
      minimum_level: {
        type: String,
        enum: ['high_school', 'associate', 'bachelor', 'master', 'phd'],
      },
      common_fields: [String],
      certifications: [String],
    },
    // Work Environment
    work_environment: {
      work_type: [String], // remote, hybrid, on-site
      environment: [String], // office, laboratory, outdoors, etc.
      travel_required: Boolean,
      physical_demands: String,
    },
    // Career Path & Growth
    career_path: {
      entry_positions: [String],
      growth_positions: [String],
      top_positions: [String],
    },
    // Related Fields (Similar careers)
    related_careers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Career',
      },
    ],
    // Companies/Industries
    common_industries: [String],
    top_companies: [String],
    // Additional Information
    learning_paths: [String], // Resources for learning
    typical_day: String, // Day-in-life description
    pros: [String],
    cons: [String],
    // Popularity & Stats
    views_count: { type: Number, default: 0 },
    favorites_count: { type: Number, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    // Status
    is_active: { type: Boolean, default: true },
    is_featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for searching
careerSchema.index({ title: 'text', description: 'text', domain: 1 });

export default mongoose.model('Career', careerSchema);
