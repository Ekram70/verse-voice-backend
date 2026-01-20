import Blog from '../models/blogsModel.mjs';

const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: 'Blog removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default deleteBlog;
