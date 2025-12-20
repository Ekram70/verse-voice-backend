import nodemailer from 'nodemailer';

const createTransporter = () => {
  // Use 'service' for Gmail to avoid DNS resolution issues on serverless platforms
  const isGmail = process.env.EMAIL_HOST?.includes('gmail');

  const config = isGmail
    ? {
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      }
    : {
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: process.env.EMAIL_PORT === '465',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      };

  return nodemailer.createTransport(config);
};

const sendEmailUtility = async (EmailTo, EmailText, EmailSub) => {
  try {
    const transporter = createTransporter();

    // Verify SMTP connection
    console.log('Verifying SMTP connection...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_FROM:', process.env.EMAIL_FROM);
    await transporter.verify();
    console.log('SMTP connection verified successfully');

    const mailOptions = {
      from: `VerseVoice <${process.env.EMAIL_FROM}>`,
      to: EmailTo,
      subject: EmailSub,
      html: EmailText,
    };

    console.log('Sending email to:', EmailTo);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', JSON.stringify(info));
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error details:', error.message);
    console.error('Email error code:', error.code);
    console.error('Email error response:', error.response);
    throw new Error(error.message);
  }
};

export default sendEmailUtility;
