import Blog from '../models/blogsModel.mjs';

const updateBlog = async (req, res) => {
  const { category, isFeatured, title, content, blogPicUrl } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.createdBy.toString() !== req.user)
      return res.status(403).json({ message: 'User not authorized' });

    blog.category = category || blog.category;
    blog.isFeatured = isFeatured || blog.isFeatured;
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.blogPicUrl = blogPicUrl || blog.blogPicUrl;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default updateBlog;
