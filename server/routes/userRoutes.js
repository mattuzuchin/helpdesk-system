const express = require("express");
const router = express.Router();
const routeMiddleware = require("../middleware/routeMiddleware");
const authorized = require("../middleware/authorizeUser.js")
const {
  deleteUserViaID,
  changeUserRole
} = require("../controllers/userController");

router.delete("/delete/:id", routeMiddleware, authorized("admin", "staff","user"),deleteUserViaID);

router.patch("/:id/changerole", routeMiddleware, authorized("admin"),changeUserRole);

module.exports = router;