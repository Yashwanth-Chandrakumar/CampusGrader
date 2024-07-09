import mongoose from 'mongoose';

const idSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    collegeReviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College',
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    adminNotes: {
      type: String,
      default: ''
    }
  }, { timestamps: true });

const IdCardUpload = mongoose.models.IdCardUpload || mongoose.model('IdCardUpload', idSchema);
export default IdCardUpload;