const handleUpload = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  blogImg = url + '/' + req.files['blogImage'][0].filename;
  authorImg = url + '/' + req.files['authorImage'][0].filename;
  req.body.blogPicUrl = blogImg;
  req.body.authorImage = authorImg;
  next();
};

export default handleUpload;
