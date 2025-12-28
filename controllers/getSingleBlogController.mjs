import Blog from '../models/blogsModel.mjs';
import Comment from '../models/commentsModel.mjs';

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate({
      path: 'comments',
      populate: { path: 'createdBy', select: 'name avatar' },
    });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    // Fetch all replies for comments on this blog
    const replies = await Comment.find({
      blog: req.params.id,
      parentComment: { $ne: null },
    }).populate('createdBy', 'name avatar');

    // Convert to plain object and add replies
    const blogObj = blog.toObject();
    blogObj.replies = replies;

    res.json(blogObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default getBlogById;
