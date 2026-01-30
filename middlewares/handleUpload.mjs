const handleUpload = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  if (req.files && req.files['blogImage']) {
    const blogImg = url + '/' + req.files['blogImage'][0].filename;
    req.body.blogPicUrl = blogImg;
  }
  if (req.files && req.files['authorImage']) {
    const authorImg = url + '/' + req.files['authorImage'][0].filename;
    req.body.authorImage = authorImg;
  }
  next();
};

export default handleUpload;
