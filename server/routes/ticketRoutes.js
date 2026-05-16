const express = require("express");
const router = express.Router();
const tickets = require("./dummyData.js");
const validation = require("../middleware/validationUtils.js");
//get all tickets for a user
router.get("/", async (req, res) => {
  
  res.json(tickets);

});

//create a ticket with a given title, description, and name of the person. the user does not need an account only people handling reports needs an account
router.post("/createticket", async(req, res) => {
  const { title, description, name } = req.body;

  // Validation
  valudationResult = validation.validateCreateTicket(title, description);
  if (!valudationResult.isValid) {
    return res.status(400).json({
      message: valudationResult.message
    });
  }
  
  const newTicket = {
    id: Math.floor(Math.random() * 1000000), //as of now there is no official db so we will create random id
    title: title,
    description: description,
    status: "open", //when a ticket is created, the status will be open by default
    createdDate: new Date().toISOString(),
    closeDate: null,
    assignedTo: null,
    createdBy: name
  };
  tickets.push(newTicket);
  res.status(201).json({
    message: "Ticket creation was successful",
    ticketCreated: newTicket
  });
});

//when a ticket is closed, the ticket will not be "deleted" but will still appear. anyone with the role of manager can change this status back to open
router.post("/closeticket/", async(req, res) => {
  const { ticketID } = req.query; 
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
    closedBy: ticket.closedBy = "manager"
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

//get title for a ticket to display in the dashboard via id query parameter (ex: /gettickettitle?ticketID=12345)
router.get("/gettickettitle/", async(req, res) => {
  const { ticketID } = req.query; //ticketID must be the name of the query parameter or else it will not work. 
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

//filter by status category - it will be a query parameter, for example, /tickets?status=open will return all open tickets, /tickets?status=closed will return all closed tickets, etc
router.get("/filter", async(req, res) => {
  const { status } = req.query;
  validationResult = validation.validateFilterStatus(status);
  if (!validationResult.isValid) {
    return res.status(400).json({
      message: validationResult.message
    });
  }
  const filteredTickets = tickets.filter(t => t.status === status);
  res.status(200).json({
    tickets: filteredTickets
  });
});

//add a comment to a specific ticket - this means via frontend when a user clicks on the ticket, the details will be there along with an option to add a comment
router.post("/:id/comments", async (req, res) => {
  const ticketID = parseInt(req.params.id);
  const { comment } = req.body;
  const validationResult = validation.validateTicketID(ticketID);
  if (!validationResult.isValid) {
    return res.status(400).json({
      message: validationResult.message
    });
  }
  const ticket = tickets.find(t => t.id === ticketID);
  if (!ticket) {
    return res.status(404).json({
      message: "Ticket not found"
    });
  }
  ticket.comments = ticket.comments || []; //not all ticket smay have comments depending on the sitation of the ticket, so create emppty array when a comment is needed
  ticket.comments.push(comment);
  res.status(200).json({
    message: "Comment added successfully by an agent", 
    ticket
  });

});
module.exports = router;