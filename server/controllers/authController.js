const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const validation = require("../utils/validationUtils.js");

const prisma = new PrismaClient();

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
                password: hashedPassword
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
                role: newUser.role
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
    registerUser
};