const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  const ticketId = Math.floor(Math.random() * 1000000);
  const userId = req.params.userId;

  res.json({
    ticketId
  });
});

router.post("/createticket", (req, res) => {
  const { title, description } = req.body;

  // Validation
  if (!title || !description) {
    return res.status(400).json({
      message: "Title and description are required"
    });
  }
  const ticketId = Math.floor(Math.random() * 1000000);

  res.status(201).json({
    message: "Ticket created",
    ticketID: ticketId
  });
});
module.exports = router;