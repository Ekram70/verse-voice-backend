import mongoose from 'mongoose';

const blogRequestSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    blogImage: { type: String, default: '' },
    authorName: { type: String, required: true, trim: true },
    authorAvatar: { type: String, default: '' },
    authorDetails: { type: String, default: '' },
    timeRead: { type: String, default: '3 mins read' },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNote: { type: String, default: '' },
  },
  { timestamps: true, versionKey: false }
);

const BlogRequest = mongoose.model('BlogRequest', blogRequestSchema);
export default BlogRequest;
