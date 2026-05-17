const express = require("express");
const router = express.Router();
const {
  getAllTickets,
  createTicket,
  closeTicket,
  assignTicket,
  getAllTicketsByAgent,
  getAllTicketsByStatus,
  getOldTickets,
  getTicketTitle,
  filterTicketsByStatus,
  addCommentToTicket,
  deleteTicketViaID
  //updateStatus
} = require("../controllers/controllerTickets");
//get all tickets for a user
router.get("/", getAllTickets);

//create a ticket with a given title, description, and name of the person. the user does not need an account only people handling reports needs an account
router.post("/createticket", createTicket);

//when a ticket is closed, the ticket will not be "deleted" but will still appear. anyone with the role of manager can change this status back to open
router.patch("/:id/close", closeTicket);
// assign a ticket to an agent, when assigned, the ticket status will be changed to claimed or in progress
router.patch("/:ticketID/assign", assignTicket);


//get all tickets assigned to a specific agent via query parameter (ex: /assignedtickets?agentID=12345)
router.get("/assignedtickets/", getAllTicketsByAgent);

//get all tickets assigned to an agent with the status that is passed as a query parameter (ex: /statustickets?agentID=12345&status=claimed)
router.get("/statustickets/", getAllTicketsByStatus);

//get all tickets that are older than 14 days and still open - this is for any staff to see and handle tickets. 
router.get("/oldtickets/", getOldTickets);

// this route is for upadting the satus, however, it may not be used since we already have a route for closing the ticket, and the status can be updated to closed when the ticket is closed, so this route may not be necessary, but it can be used for updating the status to open if needed

// router.put("/updateStatus", updateStatus);

//get title for a ticket to display in the dashboard via id query parameter (ex: /gettickettitle?ticketID=12345)
router.get("/gettickettitle/", getTicketTitle);

//filter by status category - it will be a query parameter, for example, /tickets?status=open will return all open tickets, /tickets?status=closed will return all closed tickets, etc
router.get("/filter", filterTicketsByStatus);

//add a comment to a specific ticket - this means via frontend when a user clicks on the ticket, the details will be there along with an option to add a comment
router.post("/:id/comments", addCommentToTicket);


//delete a ticket via id
router.delete("/delete/:id", deleteTicketViaID);
module.exports = router;