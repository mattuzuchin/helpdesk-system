const express = require("express");
const router = express.Router();
const tickets = require("./dummyData.js");
const validation = require("../middleware/validationUtils.js");
//get all tickets for a user
router.get("/", async (req, res) => {
  
  res.json(tickets);

});

router.post("/createticket", async(req, res) => {
  const { title, description } = req.body;

  // Validation
  valudationResult = validation.validateCreateTicket(title, description);
  if (!valudationResult.isValid) {
    return res.status(400).json({
      message: valudationResult.message
    });
  }
  
  
  const ticketId = Math.floor(Math.random() * 1000000);

  res.status(201).json({
    message: "Ticket created",
    ticketID: ticketId
  });
});

router.post("/closeticket", async(req, res) => {
  const { ticketID } = req.body;
  validationResult = validation.validateCloseTicket(ticketID);
  if (!validationResult.isValid) {
    return res.status(400).json({
      message: validationResult.message
    });
  }
  res.status(200).json({
    message: "Ticket closed",
    closedDate: tickets[0].closeDate = new Date().toISOString(),
    ticket: tickets[0]
  });
});

router.post("/assignticket", async(req, res) => {
  const { ticketID, agentID } = req.body;
  validationResult = validation.validateAssignTicket(ticketID, agentID);
  if (!validationResult.isValid) {
    return res.status(400).json({
      message: validationResult.message
    });
  }
  res.status(200).json({
    message: "Ticket assigned",
    ticketID: ticketID,
    agentID: agentID
  });
});
router.put("/updateStatus", async(req, res) => {
  const  { ticketID, statusChange }  = req.body;
  validationResult = validation.validateUpdateStatus(ticketID, statusChange);
  if (!validationResult.isValid) {
    return res.status(400).json({
      message: validationResult.message
    });
  }
  let j = -1;
  for(let i = 0; i < tickets.length; i++) {
    if(tickets[i].id === ticketID) {
      tickets[i].status = req.body.statusChange;
      j = i;
      break;
    }
  }
  if(j === -1) {
    return res.status(404).json({
      message: "Ticket not found, please try again with a valid ticket ID"
    });
  }
  res.status(200).json({
    message: "Ticket updated",
    ticket: tickets[j]
  });
});
module.exports = router;