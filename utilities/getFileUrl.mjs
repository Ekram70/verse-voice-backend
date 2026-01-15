/**
 * Get the URL for an uploaded file.
 * - Cloudinary: file.path contains the full URL
 * - Local storage: construct URL from filename
 */
const getFileUrl = (req, file) => {
  // Cloudinary stores the full URL in file.path
  if (file.path && file.path.startsWith('http')) {
    return file.path;
  }
  // Local storage: construct URL from filename
  const url = req.protocol + '://' + req.get('host');
  return url + '/' + file.filename;
};

export default getFileUrl;
