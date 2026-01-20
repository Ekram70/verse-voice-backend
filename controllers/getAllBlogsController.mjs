import Blog from '../models/blogsModel.mjs';

const getBlogs = async (req, res) => {
  const { page = 1, limit = 10, search = '', sort = 'createdAt', order = 'desc' } = req.query;

  try {
    const filter = search ? { title: new RegExp(search, 'i') } : {};
    const sortObj = { [sort]: order === 'asc' ? 1 : -1 };

    const blogs = await Blog.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('comments');

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ submittedBy: req.user.id })
      .sort({ createdAt: -1 })
      .populate('comments');

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default getBlogs;
