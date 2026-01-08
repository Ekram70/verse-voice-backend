import Blog from '../models/blogsModel.mjs';
import Favorite from '../models/favoriteModel.mjs';

export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isFeatured: true }).populate('comments');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPopularBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const blogs = await Favorite.aggregate([
      { $group: { _id: '$blog', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'blogs',
          localField: '_id',
          foreignField: '_id',
          as: 'blog',
        },
      },
      { $unwind: '$blog' },
      { $replaceRoot: { newRoot: '$blog' } },
    ]);

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBlogsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    const blogs = await Blog.find({ category: categoryName }).populate('comments');
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleFeatured = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (!blog.isFeatured) {
      const count = await Blog.countDocuments({ isFeatured: true });
      if (count >= 5) {
        return res.status(400).json({ message: 'Maximum 5 featured blogs allowed' });
      }
    }

    blog.isFeatured = !blog.isFeatured;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
