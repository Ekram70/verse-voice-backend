import Blog from '../models/blogsModel.mjs';
import Like from '../models/likesModel.mjs';

const unlikeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const like = await Like.findOneAndDelete({
      user: req.user,
      blog: req.params.blogId,
    });

    if (!like) return res.status(400).json({ message: 'Blog not liked yet' });

    blog.likesCount -= 1;
    await blog.save();

    res.json({ message: 'Blog unliked' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default unlikeBlog;
