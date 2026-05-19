const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const validation = require("../utils/validationUtils.js");

const changeUserStatus = async (req, res) => {
    const targetUserId = req.params.id;
    const { status } = req.body;
    if(!validation.validateStatus(status)) {
        return res.status(400).json({
            message: "Invalid status. Must be online, offline, away, or busy"
        });        
    }
    try {
        const userBeingChanged= await prisma.user.findUnique({ where: { id: targetUserId } });
        if(!userBeingChanged) {
            return res.status(404).json({
                message: "User not found - please try again"
            });
        }
        const updatedUser = await prisma.user.update({
            where: { id: targetUserId },
            data: { status }
        });
        return res.status(200).json({
            message: "Users status successfully changed",
            userChanged: updatedUser.status
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error changing",
            error: error.message
        });
    }
};


//only admins or the users themselves can delete an account
const deleteUserViaID = async (req, res) => {
    const targetUserId = req.params.id;
    const userBeingDeleted = await prisma.user.findUnique({ where: { id: targetUserId } });
    try {
        if(userBeingDeleted === null) {
            return res.status(404).json({
                message: "User not found - please try again"
            });
        }
        await prisma.user.delete({
            where: { id: targetUserId }
        });
        return res.status(200).json({
            message: "User deleted successfully",
            userDeleted: userBeingDeleted.name
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error deleting user"
        });
    }
};

//only admins can change user permission
const changeUserRole = async (req, res) => {
    const targetUserId = req.params.id;
    const { newRole } = req.body;
    const requester = req.user;
    const isAdmin = requester.role === "admin";

    if (!isAdmin) {
        return res.status(403).json({
            message: "Only admins can change user roles"
        });
    }
    if (!validation.validateRole(newRole)) {
        return res.status(400).json({
            message: "Invalid role. Valid roles are: user, staff, admin"
        });
    }
    try {
        const updatedUser = await prisma.user.update({
            where: { id: targetUserId },
            data: { role: newRole }
        });
        return res.status(200).json({
            message: "User role updated successfully",
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating user role"
        });
    }
};

const getUserName = async (req, res) => {
    const targetUserId = req.params.id;
    try {
        const getName = await prisma.user.findMany({
            where: { id: targetUserId }
        });

        return res.status(200).json({
           name: getName[0].name
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error getting name via ID"
        });
    }
};
module.exports = {
  deleteUserViaID,
  changeUserRole,
  changeUserStatus,
  getUserName
};