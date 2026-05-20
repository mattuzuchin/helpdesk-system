const express = require("express");
const router = express.Router();
const routeMiddleware = require("../middleware/routeMiddleware");
const authorized = require("../middleware/authorizeUser.js")
const {
  deleteUserViaID,
  changeUserRole,
  changeUserStatus,
  getUserName,
  getTicketViaID
} = require("../controllers/userController");
const authorizeRoles = require("../middleware/authorizeUser.js");
//const { getTicketViaID } = require("../controllers/ticketController.js");

router.delete("/delete/:id", routeMiddleware, authorized("admin", "staff","user"),deleteUserViaID);

router.patch("/:id/changerole", routeMiddleware, authorized("admin"),changeUserRole);

router.patch("/:id/changeuserstatus", routeMiddleware, authorized("admin", "staff", "user"),changeUserStatus);

router.get("/:id/getName", routeMiddleware, authorized("admin", "staff", "user"), getUserName);

module.exports = router;