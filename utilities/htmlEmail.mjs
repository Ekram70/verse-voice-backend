const htmlEmail = (otpCode, purpose = 'password') => {
  const purposeText = purpose === 'registration'
    ? 'complete your registration'
    : 'reset your password';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>VerseVoice OTP</title>

    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap"
      rel="stylesheet"
    />
  </head>
  <body
    style="
      margin: 0;
      font-family: 'Poppins', sans-serif;
      background: #ffffff;
      font-size: 14px;
    "
  >
    <div
      style="
        max-width: 680px;
        margin: 0 auto;
        padding: 45px 30px 60px;
        background: linear-gradient(135deg, #06060e 0%, #0d0d1a 100%);
        font-size: 14px;
        color: #eef0f6;
      "
    >
      <header style="text-align: center; padding-bottom: 20px;">
        <h2 style="
          margin: 0;
          background: linear-gradient(135deg, #00e5ff, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 28px;
          font-weight: 700;
        ">VerseVoice</h2>
      </header>
      <main>
        <div
          style="
            margin: 0;
            padding: 50px 30px;
            background: rgba(12, 12, 30, 0.9);
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
          "
        >
          <div style="width: 100%; max-width: 489px; margin: 0 auto;">
            <h1
              style="
                margin: 0;
                font-size: 24px;
                font-weight: 600;
                color: #00e5ff;
              "
            >
              Your OTP Code
            </h1>
            <p
              style="
                margin: 0;
                margin-top: 17px;
                font-weight: 400;
                letter-spacing: 0.56px;
                color: #8b8fa8;
                line-height: 1.6;
              "
            >
              Use the following OTP to ${purposeText}.
              This code is valid for
              <span style="font-weight: 600; color: #00e5ff;">10 minutes</span>.
              Do not share this code with anyone.
            </p>
            <p
              style="
                margin: 0;
                margin-top: 40px;
                margin-bottom: 40px;
                font-size: 42px;
                font-weight: 700;
                letter-spacing: 12px;
                background: linear-gradient(135deg, #00e5ff, #a855f7);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              "
            >
              ${otpCode}
            </p>
            <p style="
              margin: 0;
              font-size: 12px;
              color: #555870;
            ">
              If you didn't request this code, please ignore this email.
            </p>
          </div>
        </div>
      </main>
      <footer style="text-align: center; padding-top: 30px;">
        <p style="margin: 0; font-size: 12px; color: #555870;">
          &copy; ${new Date().getFullYear()} VerseVoice. All rights reserved.
        </p>
      </footer>
    </div>
  </body>
</html>
`;
};

export default htmlEmail;
