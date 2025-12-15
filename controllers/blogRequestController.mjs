import Blog from '../models/blogsModel.mjs';
import BlogRequest from '../models/blogRequestModel.mjs';
import sendNewBlogNotification from '../utilities/sendNewBlogEmail.mjs';

// Client submits a blog request
export const submitBlogRequest = async (req, res) => {
  try {
    const { title, category, content, authorName, authorDetails, timeRead } = req.body;

    const blogRequest = new BlogRequest({
      title,
      category,
      content,
      blogImage: req.body.blogPicUrl || '',
      authorName,
      authorAvatar: req.body.authorImage || '',
      authorDetails: authorDetails || '',
      timeRead: timeRead || '3 mins read',
      submittedBy: req.user.id,
    });

    const saved = await blogRequest.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin gets all requests
export const getAllRequests = async (req, res) => {
  try {
    const requests = await BlogRequest.find()
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Client gets their own requests
export const getMyRequests = async (req, res) => {
  try {
    const requests = await BlogRequest.find({ submittedBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin gets a single request by ID
export const getRequestById = async (req, res) => {
  try {
    const request = await BlogRequest.findById(req.params.id)
      .populate('submittedBy', 'name email');
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin approves a request -> creates a blog from it
export const approveRequest = async (req, res) => {
  try {
    const request = await BlogRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Create blog from request data
    const blog = new Blog({
      title: request.title,
      category: request.category,
      content: request.content,
      blogPicUrl: request.blogImage,
      createdBy: {
        name: request.authorName,
        avatar: request.authorAvatar,
      },
      authorDetails: request.authorDetails,
      timeRead: request.timeRead,
      publishDate: new Date(),
      submittedBy: request.submittedBy,
    });

    await blog.save();
    sendNewBlogNotification(blog);

    request.status = 'approved';
    await request.save();

    res.json({ message: 'Request approved and blog published', blog });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin rejects a request
export const rejectRequest = async (req, res) => {
  try {
    const request = await BlogRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    request.adminNote = req.body.adminNote || '';
    await request.save();

    res.json({ message: 'Request rejected', request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin edits a request before approving
export const updateRequest = async (req, res) => {
  try {
    const request = await BlogRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const { title, content, category, timeRead } = req.body;
    if (title) request.title = title;
    if (content) request.content = content;
    if (category) request.category = category;
    if (timeRead) request.timeRead = timeRead;

    const updated = await request.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin deletes a request
export const deleteRequest = async (req, res) => {
  try {
    const request = await BlogRequest.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
