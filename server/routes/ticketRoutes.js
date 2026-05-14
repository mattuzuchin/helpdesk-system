const express = require("express");

const router = express.Router();

router.get("/:userId", (req, res) => {
  const ticketId = Math.floor(Math.random() * 1000000);
  const userId = req.params.userId;

  res.json({
    ticketId,
    userId
  });
});

module.exports = router;