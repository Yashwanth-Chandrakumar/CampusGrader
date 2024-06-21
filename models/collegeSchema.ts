import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  academicRating: {
    type: Number,
    required: true,
  },
  academicReview: {
    type: String,
    required: true,
  },
  facultyRating: {
    type: Number,
    required: true,
  },
  facultyReview: {
    type: String,
    required: true,
  },
  infrastructureRating: {
    type: Number,
    required: true,
  },
  infrastructureReview: {
    type: String,
    required: true,
  },
  accommodationRating: {
    type: Number,
    required: true,
  },
  accommodationReview: {
    type: String,
    required: true,
  },
  socialLifeRating: {
    type: Number,
    required: true,
  },
  socialLifeReview: {
    type: String,
    required: true,
  },
  feeRating: {
    type: Number,
    required: true,
  },
  feeReview: {
    type: String,
    required: true,
  },
  placementRating: {
    type: Number,
    required: true,
  },
  placementReview: {
    type: String,
    required: true,
  },
  foodRating: {
    type: Number,
    required: true,
  },
  foodReview: {
    type: String,
    required: true,
  },
});

const College = mongoose.models.College || mongoose.model('College', collegeSchema);

export default College;