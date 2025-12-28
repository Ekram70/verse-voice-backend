import Blog from '../models/blogsModel.mjs';
import Comment from '../models/commentsModel.mjs';
import { createNotification } from './notificationController.mjs';

const addComment = async (req, res) => {
  const { text, parentCommentId } = req.body;

  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    let parentComment = null;
    // If replying to a comment, verify parent exists
    if (parentCommentId) {
      parentComment = await Comment.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
    }

    const comment = new Comment({
      text,
      createdBy: req.user.id,
      blog: req.params.blogId,
      parentComment: parentCommentId || null,
    });

    const createdComment = await comment.save();

    // Only add top-level comments to blog's comments array
    if (!parentCommentId) {
      blog.comments.push(createdComment._id);
      await blog.save();
    }

    // Create notification for blog owner (if commenting on their post)
    if (blog.submittedBy) {
      await createNotification({
        recipient: blog.submittedBy,
        type: 'comment',
        actionBy: req.user.id,
        blog: blog._id,
        comment: createdComment._id,
      });
    }

    // If this is a reply, also notify the parent comment author
    if (parentComment && parentComment.createdBy) {
      // Only notify if parent comment author is different from blog owner
      // (to avoid duplicate notifications)
      const parentAuthorId = parentComment.createdBy.toString();
      const blogOwnerId = blog.submittedBy?.toString();

      if (parentAuthorId !== blogOwnerId) {
        await createNotification({
          recipient: parentComment.createdBy,
          type: 'comment',
          actionBy: req.user.id,
          blog: blog._id,
          comment: createdComment._id,
        });
      }
    }

    // Populate user info before returning
    await createdComment.populate('createdBy', 'name avatar');

    res.status(201).json(createdComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default addComment;
