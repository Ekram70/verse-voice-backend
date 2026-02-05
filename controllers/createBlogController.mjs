import Blog from '../models/blogsModel.mjs';
import sendNewBlogNotification from '../utilities/sendNewBlogEmail.mjs';

const createBlog = async (req, res) => {
  const {
    category,
    isFeatured,
    title,
    content,
    blogPicUrl,
    name,
    authorImage,
    authorDetails,
    timeRead,
    publishDate,
  } = req.body;

  const blog = new Blog({
    category,
    isFeatured,
    title,
    content,
    blogPicUrl,
    createdBy: {
      name,
      avatar: authorImage,
    },
    authorDetails: authorDetails || '',
    timeRead: timeRead || '3 mins read',
    publishDate: publishDate || new Date(),
    submittedBy: req.user.id,
  });

  try {
    const createdBlog = await blog.save();
    sendNewBlogNotification(createdBlog);
    res.status(201).json(createdBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export default createBlog;
