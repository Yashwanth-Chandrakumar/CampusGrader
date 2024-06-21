import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
});

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
  academic: reviewSchema,
  faculty: reviewSchema,
  infrastructure: reviewSchema,
  accommodation: reviewSchema,
  socialLife: reviewSchema,
  fee: reviewSchema,
  placement: reviewSchema,
  food: reviewSchema,
});

const College = mongoose.models.College || mongoose.model('College', collegeSchema);

export default College;
