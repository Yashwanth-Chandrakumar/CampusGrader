import mongoose from 'mongoose';


const idCardUploadSchema = new mongoose.Schema({
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
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 7*24*60*60*1000) // 7 days from now
    }
  }, { timestamps: true });
  
  const IdCardUpload = mongoose.models.IdCardUpload || mongoose.model('IdCardUpload', idCardUploadSchema);