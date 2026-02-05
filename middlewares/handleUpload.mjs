import getFileUrl from '../utilities/getFileUrl.mjs';

const handleUpload = (req, res, next) => {
  if (req.files && req.files['blogImage']) {
    req.body.blogPicUrl = getFileUrl(req, req.files['blogImage'][0]);
  }
  if (req.files && req.files['authorImage']) {
    req.body.authorImage = getFileUrl(req, req.files['authorImage'][0]);
  }
  next();
};

export default handleUpload;
