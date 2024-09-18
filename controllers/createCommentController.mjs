import Blog from '../models/blogsModel.mjs';
import Comment from '../models/commentsModel.mjs';

const addComment = async (req, res) => {
  const { text } = req.body;

  try {
    const blog = await Blog.findById(req.params.blogId);

    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const comment = new Comment({
      text,
      createdBy: req.user,
      blog: req.params.blogId,
    });

    const createdComment = await comment.save();
    blog.comments.push(createdComment._id);
    await blog.save();

    res.status(201).json(createdComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default addComment;
