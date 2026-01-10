import mongoose from 'mongoose';

const commentReportSchema = new mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: ['spam', 'harassment', 'inappropriate', 'misinformation', 'other'],
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'dismissed'],
      default: 'pending',
    },
  },
  { timestamps: true, versionKey: false }
);

// Prevent duplicate reports from same user for same comment
commentReportSchema.index({ comment: 1, reportedBy: 1 }, { unique: true });

const CommentReport = mongoose.model('CommentReport', commentReportSchema);
export default CommentReport;
