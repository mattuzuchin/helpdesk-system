const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const validation = require("../utils/validationUtils.js");

//only admins or the users themselves can delete an account
const deleteUserViaID = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const requester = req.user; // we get this from authmiddle which gives us jwt payload
    const isSelf = requester.id === targetUserId;
    const isAdmin = requester.role === "admin";

    //this allows users to delete their own account and admins to delete any account
    if (!isSelf || !isAdmin) {
        return res.status(403).json({
            message: "You are not allowed to delete this user"
        });
    }
    try {
        await prisma.user.delete({
            where: { id: targetUserId }
        });

        return res.status(200).json({
            message: "User deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error deleting user"
        });
    }
};
module.exports = {
  deleteUserViaID
};