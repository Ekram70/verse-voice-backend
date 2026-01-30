import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    createdBy: {
      name: { type: String, required: true, trim: true },
      avatar: { type: String, default: '' },
    },
    authorDetails: { type: String, default: '' },
    timeRead: { type: String, default: '3 mins read' },
    publishDate: { type: Date, default: Date.now },
    blogPicUrl: { type: String, default: '' },
    likesCount: { type: Number, default: 0 },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true, versionKey: false }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
