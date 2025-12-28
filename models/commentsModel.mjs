import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blog: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
