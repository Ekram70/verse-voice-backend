import Comment from '../models/commentsModel.mjs';

const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.createdBy.toString() !== req.user)
      return res.status(403).json({ message: 'User not authorized' });

    await comment.remove();
    res.json({ message: 'Comment removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default deleteComment;
