import CommentReport from '../models/commentReportModel.mjs';
import Comment from '../models/commentsModel.mjs';
import Blog from '../models/blogsModel.mjs';

// User reports a comment
export const reportComment = async (req, res) => {
  try {
    const { commentId, reason, description } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user already reported this comment
    const existingReport = await CommentReport.findOne({
      comment: commentId,
      reportedBy: req.user.id,
    });

    if (existingReport) {
      return res.status(400).json({ message: 'You have already reported this comment' });
    }

    const report = new CommentReport({
      comment: commentId,
      reportedBy: req.user.id,
      reason,
      description: description || '',
    });

    await report.save();
    res.status(201).json({ message: 'Comment reported successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already reported this comment' });
    }
    res.status(500).json({ message: err.message });
  }
};

// Admin gets all reports
export const getAllReports = async (req, res) => {
  try {
    const reports = await CommentReport.find()
      .populate({
        path: 'comment',
        populate: [
          { path: 'createdBy', select: 'name email avatar' },
          { path: 'blog', select: 'title _id' },
        ],
      })
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin updates report status
export const updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'reviewed', 'dismissed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const report = await CommentReport.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin deletes a report
export const deleteReport = async (req, res) => {
  try {
    const report = await CommentReport.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin deletes the reported comment (and the report)
export const deleteReportedComment = async (req, res) => {
  try {
    const report = await CommentReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const comment = await Comment.findById(report.comment);
    if (comment) {
      // Remove from blog's comments array
      await Blog.findByIdAndUpdate(comment.blog, {
        $pull: { comments: comment._id },
      });

      // Delete any replies
      await Comment.deleteMany({ parentComment: comment._id });

      // Delete the comment
      await Comment.findByIdAndDelete(comment._id);
    }

    // Delete all reports for this comment
    await CommentReport.deleteMany({ comment: report.comment });

    res.json({ message: 'Comment and reports deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
