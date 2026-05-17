const express = require("express");
const router = express.Router();
const routeMiddleware = require("../middleware/routeMiddleware");

const {
  deleteUserViaID
} = require("../controllers/userController");

router.delete("/delete/:id", routeMiddleware, deleteUserViaID);

module.exports = router;