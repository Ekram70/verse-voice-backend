import Blog from '../models/blogsModel.mjs';
import Like from '../models/likesModel.mjs';
import { createNotification } from './notificationController.mjs';

const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const existingLike = await Like.findOne({
      user: req.user.id,
      blog: req.params.blogId,
    });

    if (existingLike) {
      return res.status(400).json({ message: 'Blog already liked' });
    }

    const like = new Like({
      user: req.user.id,
      blog: req.params.blogId,
    });

    await like.save();
    blog.likesCount += 1;
    await blog.save();

    // Create notification for blog owner
    if (blog.submittedBy) {
      await createNotification({
        recipient: blog.submittedBy,
        type: 'like',
        actionBy: req.user.id,
        blog: blog._id,
      });
    }

    res.status(201).json({ message: 'Blog liked' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default likeBlog;
