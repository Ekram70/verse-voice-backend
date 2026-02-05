import User from '../models/usersModel.mjs';
import Blog from '../models/blogsModel.mjs';
import Comment from '../models/commentsModel.mjs';
import Favorite from '../models/favoriteModel.mjs';
import Like from '../models/likesModel.mjs';
import Notification from '../models/notificationModel.mjs';
import BlogRequest from '../models/blogRequestModel.mjs';
import CommentReport from '../models/commentReportModel.mjs';
import sendEmail from '../utilities/sendEmail.mjs';

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

    // Send email notification (fire and forget)
    const subject = user.isBanned ? 'Your VerseVoice account has been banned' : 'Your VerseVoice account has been unbanned';
    const html = user.isBanned
      ? `<p>Hi ${user.name},</p><p>Your VerseVoice account has been <strong>banned</strong> due to a violation of our terms of service.</p><p>You will no longer be able to log in or use the platform. If you believe this was a mistake, please contact our support team.</p>`
      : `<p>Hi ${user.name},</p><p>Your VerseVoice account has been <strong>unbanned</strong>. You can now log in and use the platform again.</p>`;
    sendEmail(user.email, html, subject).catch(() => {});

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

    // Send deletion email before removing (fire and forget)
    sendEmail(
      user.email,
      `<p>Hi ${user.name},</p><p>Your VerseVoice account and all associated content have been <strong>permanently deleted</strong> by an administrator.</p><p>If you believe this was a mistake, please contact our support team.</p>`,
      'Your VerseVoice account has been deleted'
    ).catch(() => {});

    // Clean up user's comments from blogs
    await Blog.updateMany(
      { comments: { $in: user.comments } },
      { $pull: { comments: { $in: user.comments } } }
    );

    // Delete user's comments
    await Comment.deleteMany({ createdBy: user._id });

    // Delete user's favorites and update favorite counts
    await Favorite.deleteMany({ user: user._id });

    // Delete user's likes and decrement likesCount on affected blogs
    const userLikes = await Like.find({ user: user._id });
    const likedBlogIds = userLikes.map((l) => l.blog);
    await Like.deleteMany({ user: user._id });
    if (likedBlogIds.length > 0) {
      await Blog.updateMany(
        { _id: { $in: likedBlogIds } },
        { $inc: { likesCount: -1 } }
      );
    }

    // Delete notifications sent to or triggered by user
    await Notification.deleteMany({
      $or: [{ recipient: user._id }, { actionBy: user._id }],
    });

    // Delete user's blog requests
    await BlogRequest.deleteMany({ submittedBy: user._id });

    // Delete user's comment reports
    await CommentReport.deleteMany({ reportedBy: user._id });

    // Delete user's blogs
    await Blog.deleteMany({ submittedBy: user._id });

    // Delete the user
    await User.findByIdAndDelete(user._id);

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
