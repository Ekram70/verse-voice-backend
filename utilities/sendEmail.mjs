import nodemailer from 'nodemailer';

const sendEmailUtility = async (EmailTo, EmailText, EmailSub) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: false,
    auth: {
      user: process.env.FROM_EMAIL,
      pass: process.env.FROM_EMAIL_PASS,
    },
  });

  let mailOptions = {
    from: `Classroom Writers <${process.env.FROM_EMAIL}>`,
    to: EmailTo,
    subject: EmailSub,
    text: EmailText,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmailUtility;
