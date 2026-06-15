const prisma = require("../utils/prisma.js");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const validation = require("../utils/validationUtils.js");
const crypto = require("crypto");
const { sendPasswordResetEmail, sendLoginEmail } = require("../utils/email.js");
const logOutUser = async (req, res) => {
    const userId = req.user.id;
    try {
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                tokenVersion: {
                    increment: 1
                }
            }
        });
        return res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error logging out"
        });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(200).json({ message: "If that email exists, a reset link has been sent" });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();
        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry
            }
        });
        const check = await prisma.user.findUnique({ where: { email } });
        await sendPasswordResetEmail(email, resetToken);

        return res.status(200).json({ message: "If that email exists, a reset link has been sent" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending reset email" });
    }
};
const verifyResetToken = async (req, res) => {
    const { token } = req.body;
    console.log("received token:", token);

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date().toISOString() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        return res.status(200).json({ message: "Token valid" });
    } catch (error) {
        return res.status(500).json({ message: "Error verifying token" });
    }
};
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: "Token and new password are required" });
    }

    if (!validation.isValidPassword(newPassword)) {
        return res.status(400).json({ message: "Password does not meet requirements" });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
                tokenVersion: { increment: 1 }
            }
        });

        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error resetting password" });
    }
};
const changePassword = async (req, res) => {
    const userId = req.user.id;
    const {newPW} = req.body;
    if(!newPW) {
        return res.status(400).json({message: "New Password required"})
    }

    if(!validation.isValidPassword(newPW)) {
        return res.status(400).json({message: "Password requirements are not met"})
    }
    try {
        const hashedPW = await bcrypt.hash(newPW, 10);
        await prisma.user.update({
            where: {id: userId},
            data: {
                password: hashedPW,
                tokenVersion: {increment: 1}
            }
        });
        return res.status(200).json({
            message: "PW changed successful"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error changing PW"
        });
    }
};



const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password ) {
        return res.status(400).json({
            message: "Name, email, and password are required"
        });
    }
    if(!validation.validateEmail(email)) {
        return res.status(400).json({
            message: "Invalid email format"
        });
    }
    if(!validation.isValidPassword(password)) {
        return res.status(400).json({
            message: "Password must be 15 characters in length, have a special character, and have digits such that they add up to 20."
        });
    }
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already in use"
            });
        }
        // hsh password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const newUser = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                role: "user" // default role is user
            }
        });
        // gnerate JWT
        const token = generateToken(newUser);
        return res.status(201).json({
            message: "Registration successful",
            token: token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                status: newUser.status
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error registering user"
        });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        // compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
        // generate token
        const token = generateToken(user);
        await sendLoginEmail(email);
        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error logging in"
        });
    }
};
module.exports = {
    loginUser,
    registerUser,
    logOutUser,
    changePassword,
    forgotPassword,
    resetPassword,
    verifyResetToken
};