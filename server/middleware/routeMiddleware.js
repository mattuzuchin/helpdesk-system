const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma.js");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    const token = authHeader.split(" ")[1];

    try {              
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });
        if (!user || decoded.tokenVersion !== user.tokenVersion) {
            return res.status(401).json({ message: "Token invalidated" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        console.log("verify error:", error.message);
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};
module.exports = authMiddleware;