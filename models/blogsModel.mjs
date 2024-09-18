import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    isFeatured: { type: Boolean, default: false },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blogPicUrl: { type: String, default: '' },
    likesCount: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true, versionKey: false }
);

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
