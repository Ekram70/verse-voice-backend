import Blog from '../models/blogsModel.mjs';

const getBlogs = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  try {
    const blogs = await Blog.find({ title: new RegExp(search, 'i') })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Blog.countDocuments();
    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default getBlogs;
