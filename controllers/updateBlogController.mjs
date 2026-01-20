import Blog from '../models/blogsModel.mjs';

const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const {
      category,
      title,
      content,
      blogPicUrl,
      authorDetails,
      timeRead,
      publishDate,
      name,
      authorImage,
      isFeatured,
    } = req.body;

    if (category !== undefined) blog.category = category;
    if (title !== undefined) blog.title = title;
    if (content !== undefined) blog.content = content;
    if (blogPicUrl !== undefined) blog.blogPicUrl = blogPicUrl;
    if (authorDetails !== undefined) blog.authorDetails = authorDetails;
    if (timeRead !== undefined) blog.timeRead = timeRead;
    if (publishDate !== undefined) blog.publishDate = publishDate;
    if (isFeatured !== undefined) blog.isFeatured = isFeatured;
    if (name !== undefined) blog.createdBy.name = name;
    if (authorImage !== undefined) blog.createdBy.avatar = authorImage;

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export default updateBlog;
