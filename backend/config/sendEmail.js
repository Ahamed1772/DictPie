import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // app password (not your gmail password)
      },
    });

    await transporter.sendMail({
      from: `"DictPie" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });

    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email not sent:", error);
  }
};

export default sendEmail;
