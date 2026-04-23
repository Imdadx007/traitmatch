import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    career_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career',
      required: true,
    },
    // Reasons for favoriting
    notes: String,
    // Priority level
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    // Whether user is actively considering this career
    considering: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Compound unique index - each user can only favorite a career once
favoriteSchema.index({ user_id: 1, career_id: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
