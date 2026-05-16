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

router.post("/closeticket/:ticketID", async(req, res) => {
  const { ticketID } = req.params;
  const ticket = tickets.find(t => t.id === parseInt(ticketID));
  validationResult = validation.validateTicketID(parseInt(ticketID));
  if (!validationResult.isValid || !ticketID) {
    return res.status(400).json({
      message: validationResult.message
    });
  }
  if (!ticket) {
    return res.status(404).json({
      message: "The ticket with the provided ID does not exist, please try again with a valid ticket ID"
    });
  }
  res.status(200).json({
    message: "Ticket successfully closed",
    closedDate: ticket.closeDate = new Date().toISOString(),
    status: ticket.status = "closed",
    ticket: ticket
  });
});
// assign a ticket to an agent, when assigned, the ticket status will be changed to claimed or in progress
router.post("/assignticket/:agentID/:ticketID", async (req, res) => {

  const agentID = parseInt(req.params.agentID);
  const ticketID = parseInt(req.params.ticketID);
  validationResult = validation.validateAssignTicket(ticketID, agentID);
  if (!validationResult.isValid) {
    return res.status(400).json({ 
      message: validationResult.message
    });
  } 
  const ticket = tickets.find(t => t.id === ticketID);

  if (!ticket || ticket.status === "closed" || ticket.status === "claimed") {
    return res.status(404).json({
      message: "Ticket not found or already assigned/closed, please try again with a valid ticket ID"
    });
  }
  ticket.assignedTo = agentID;
  ticket.status = "claimed";

  res.status(200).json({
    message: "Ticket assigned",
    ticketID: ticket.id,
    agentID: ticket.assignedTo,
    status: ticket.status
  });

});

// this route is for upadting the satus, however, it may not be used since we already have a route for closing the ticket, and the status can be updated to closed when the ticket is closed, so this route may not be necessary, but it can be used for updating the status to open if needed

// router.put("/updateStatus", async(req, res) => {
//   const  { ticketID, statusChange }  = req.body;
//   validationResult = validation.validateUpdateStatus(ticketID, statusChange);
//   if (!validationResult.isValid) {
//     return res.status(400).json({
//       message: validationResult.message
//     });
//   }
//   let j = -1;
//   for(let i = 0; i < tickets.length; i++) {
//     if(tickets[i].id === ticketID) {
//       tickets[i].status = req.body.statusChange;
//       j = i;
//       break;
//     }
//   }
//   if(j === -1) {
//     return res.status(404).json({
//       message: "Ticket not found, please try again with a valid ticket ID"
//     });
//   }
//   res.status(200).json({
//     message: "Ticket updated",
//     ticket: tickets[j]
//   });
// });

//get title for a ticket to display in the dashboard
router.get("/gettickettitle/:ticketID", async(req, res) => {
  const { ticketID } = req.params;
  const ticket = tickets.find(t => t.id === parseInt(ticketID));
  validationResult = validation.validateTicketID(parseInt(ticketID));
  if (!validationResult.isValid || !ticketID) {
    return res.status(400).json({
      message: validationResult.message
    });
  }
  if (!ticket) {
    return res.status(404).json({
      message: "The ticket with the provided ID does not exist, please try again with a valid ticket ID"
    });
  }
  res.status(200).json({
    title: ticket.title
  });
});
module.exports = router;