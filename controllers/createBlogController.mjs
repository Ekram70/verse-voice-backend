import Blog from '../models/blogsModel.mjs';

const createBlog = async (req, res) => {
  const { category, isFeatured, title, content, blogPicUrl } = req.body;

  const blog = new Blog({
    category,
    isFeatured,
    title,
    content,
    blogPicUrl,
    createdBy: req.user,
  });

  try {
    const createdBlog = await blog.save();
    res.status(201).json(createdBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export default createBlog;
