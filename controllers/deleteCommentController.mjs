import Comment from '../models/commentsModel.mjs';
import Blog from '../models/blogsModel.mjs';
import User from '../models/usersModel.mjs';

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if user is admin or comment owner
    const user = await User.findById(req.user.id);
    const isAdmin = user?.isSuperUser === true;
    const isOwner = comment.createdBy.toString() === req.user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'User not authorized' });
    }

    // Remove comment from blog's comments array
    await Blog.findByIdAndUpdate(comment.blog, {
      $pull: { comments: comment._id },
    });

    // Delete any replies to this comment
    await Comment.deleteMany({ parentComment: comment._id });

    // Delete the comment
    await Comment.findByIdAndDelete(comment._id);

    res.json({ message: 'Comment removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default deleteComment;
