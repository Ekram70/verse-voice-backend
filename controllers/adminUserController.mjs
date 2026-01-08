import User from '../models/usersModel.mjs';
import Blog from '../models/blogsModel.mjs';
import Comment from '../models/commentsModel.mjs';

export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  try {
    const filter = { isSuperUser: false };

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleBanUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isSuperUser) {
      return res.status(403).json({ message: 'Cannot ban an admin user' });
    }

    user.isBanned = !user.isBanned;
    await user.save({ validateBeforeSave: false });

    res.json({ user: { _id: user._id, isBanned: user.isBanned } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isSuperUser) {
      return res.status(403).json({ message: 'Cannot delete an admin user' });
    }

    // Clean up user's comments from blogs
    await Blog.updateMany(
      { comments: { $in: user.comments } },
      { $pull: { comments: { $in: user.comments } } }
    );

    // Delete user's comments
    await Comment.deleteMany({ createdBy: user._id });

    // Delete user's blogs
    await Blog.deleteMany({ submittedBy: user._id });

    // Delete the user
    await User.findByIdAndDelete(user._id);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
