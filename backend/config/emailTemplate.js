const emailTemplate = (name,code) => {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>DictPie - Verification Code</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f6f8;
            padding: 0;
            margin: 0;
          }
          .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            padding: 25px;
            border-radius: 10px;
            border: 1px solid #e0e0e0;
          }
          .header {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 20px;
          }
          .content {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
          }
          .code-box {
            margin: 25px 0;
            text-align: center;
          }
          .code {
            display: inline-block;
            background: #007bff;
            color: #fff;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 5px;
            padding: 12px 20px;
            border-radius: 6px;
          }
          .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #888;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">DictPie</div>
          <div class="content">
            <p>Hi <strong>${name}</strong>,</p>
            <p>Here’s your verification code. Use it to complete your action securely.</p>
            <div class="code-box">
              <span class="code">${code}</span>
            </div>
            <p>If you didn’t request this code, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} DictPie. All rights reserved.
          </div>
        </div>
      </body>
    </html>
    `
    
}


export default emailTemplate;