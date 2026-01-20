import Blog from '../models/blogsModel.mjs';

const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate({
      path: 'comments',
      populate: { path: 'createdBy', select: 'name avatar' },
    });
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default getBlogById;
