const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // your gmail address
    pass: process.env.EMAIL_PASS,   // App Password (not your real password)
  },
});

const FROM_EMAIL = process.env.EMAIL_USER;

const sendPasswordResetEmail = async (toEmail, resetToken) => {
  const resetLink = `https://helpdesk-frontend-sjje.vercel.app/resetPassword?token=${resetToken}`;

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: toEmail,
    subject: "Password Reset Request",
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password.</p>
      <p>This link expires in 15 minutes.</p>
      <a href="${resetLink}">Reset Password</a>
      <p>If you did not request this, ignore this email.</p>
    `,
  });
};

const sendLoginEmail = async (toEmail) => {
  await transporter.sendMail({
    from: FROM_EMAIL,
    to: toEmail,
    subject: "New Login Detected",
    html: `
      <h2>New Login Detected</h2>
      <p>A new login to your account was detected. If this was you, you can safely ignore this email.</p>
    `,
  });
};

const sendTicketCreatedEmail = async (toEmail, ticketID) => {
  const ticketLink = `https://helpdesk-frontend-sjje.vercel.app/ticketView/${ticketID}`;

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: toEmail,
    subject: "Ticket Created",
    html: `
      <h2>Ticket Created</h2>
      <p>Your ticket has been created successfully.</p>
      <a href="${ticketLink}">View Ticket</a>
    `,
  });
};

module.exports = { sendPasswordResetEmail, sendLoginEmail, sendTicketCreatedEmail };