const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendPasswordResetEmail = async (toEmail, resetToken) => {
    const resetLink = `http://localhost:5173/resetPassword?token=${resetToken}`;
    
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Password Reset Request",
        html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password.</p>
            <p>This link expires in 15 minutes.</p>
            <a href="${resetLink}">Reset Password</a>
            <p>If you did not request this, ignore this email.</p>
        `
    });
};

module.exports = { sendPasswordResetEmail };