const express = require("express");
const router = express.Router();
//get all tickets for a user
router.get("/", async (req, res) => {
  // In a real application, you would fetch tickets from the database
  const tickets = [
    {
      id: 1,
      title: "Issue with login",
      description: "I can't log in to my account",
      status: "open"
    },
    {
      id: 2,
      title: "Error on dashboard",
      description: "The dashboard shows an error message",
      status: "closed"
    }
  ];
  res.json(tickets);

});

router.post("/createticket", async(req, res) => {
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