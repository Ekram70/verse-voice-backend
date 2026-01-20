import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const sendEmailUtility = async (EmailTo, EmailText, EmailSub) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `VerseVoice <${process.env.EMAIL_FROM}>`,
      to: EmailTo,
      subject: EmailSub,
      html: EmailText,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    throw new Error(error.message);
  }
};

export default sendEmailUtility;
