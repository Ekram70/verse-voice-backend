const handleUpload = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  profileImg = url + '/' + req.file.filename;
  req.body.blogPicUrl = profileImg;
  next();
};

export default handleUpload;
