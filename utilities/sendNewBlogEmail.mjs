import sendEmailUtility from './sendEmail.mjs';

const newBlogEmailTemplate = (blogTitle, blogExcerpt, blogUrl) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Blog Published</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body style="margin:0;font-family:'Poppins',sans-serif;background:#ffffff;font-size:14px;">
    <div style="max-width:680px;margin:0 auto;padding:45px 30px 60px;background:#f4f7ff;font-size:14px;color:#434343;">
      <main>
        <div style="margin:0;margin-top:30px;padding:50px 30px;background:#ffffff;border-radius:30px;text-align:center;">
          <div style="width:100%;max-width:489px;margin:0 auto;">
            <h1 style="margin:0;font-size:24px;font-weight:600;color:#1f1f1f;">New Blog Published!</h1>
            <p style="margin:0;margin-top:17px;font-weight:500;letter-spacing:0.56px;">
              A new blog has been published on VerseVoice that you might enjoy:
            </p>
            <h2 style="margin:20px 0 10px;font-size:20px;color:#0ea5ea;">${blogTitle}</h2>
            <p style="margin:0;font-size:14px;color:#666;">${blogExcerpt}</p>
            <a href="${blogUrl}" style="display:inline-block;margin-top:24px;padding:12px 32px;background:linear-gradient(135deg,#0ea5ea,#0bd1d1);color:#fff;text-decoration:none;border-radius:8px;font-weight:500;">Read Now</a>
          </div>
        </div>
      </main>
    </div>
  </body>
</html>`;
};

const sendNewBlogNotification = async (blog) => {
  try {
    const Newsletter = (await import('../models/newsletterModel.mjs')).default;
    const subscribers = await Newsletter.find({});

    if (!subscribers || subscribers.length === 0) return;

    const blogUrl = process.env.FRONTEND_URL
      ? `${process.env.FRONTEND_URL}/blogs/${blog._id}`
      : `http://localhost:3000/blogs/${blog._id}`;
    const excerpt = blog.content ? blog.content.substring(0, 150) + '...' : '';
    const html = newBlogEmailTemplate(blog.title, excerpt, blogUrl);

    for (const sub of subscribers) {
      sendEmailUtility(sub.email, html, `New Blog: ${blog.title}`).catch(() => {});
    }
  } catch (err) {
    console.error('Newsletter notification error:', err.message);
  }
};

export default sendNewBlogNotification;
