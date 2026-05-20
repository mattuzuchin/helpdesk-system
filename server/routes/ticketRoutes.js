const express = require("express");
const router = express.Router();
const routeMiddleware = require("../middleware/routeMiddleware");
const authorized = require("../middleware/authorizeUser.js")
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
  deleteTicketViaID,
  reAssignTicket,
  getAllTicketsToID,
  getTicketViaID
  //updateStatus
} = require("../controllers/ticketController");

//all routes is protected by routeMiddleWare which checks for authentication - will alter add authorization later when we have roles implemented, for example, only staff can create a ticket, only managers can close a ticket, etc. but for now, all routes are protected and can be accessed by any authenticated user.

//get all tickets for a user
router.get("/",routeMiddleware, authorized("admin","staff"),getAllTickets);

//create a ticket with a given title, description, and name of the person
router.post("/createticket", routeMiddleware, authorized("admin","staff", "user"), createTicket);

//when a ticket is closed, the ticket will not be "deleted" but will still appear. anyone with the role of manager can change this status back to open
router.patch("/:id/close", routeMiddleware, authorized("admin", "staff"), closeTicket);
// assign a ticket to an agent, when assigned, the ticket status will be changed to claimed or in progress
router.patch("/:ticketID/assign", routeMiddleware, authorized("admin", "staff"), assignTicket);
//reassign a ticket to someone else
router.patch("/:ticketID/reassign", routeMiddleware, authorized("admin"), reAssignTicket);
//get all tickets assigned to a specific agent via query parameter (ex: /assignedtickets?agentID=12345)
router.get("/assignedtickets/", routeMiddleware, authorized("admin", "staff"), getAllTicketsByAgent);

//get all tickets assigned to an agent with the status that is passed as a query parameter (ex: /statustickets?agentID=12345&status=claimed)
router.get("/statustickets/", routeMiddleware, authorized("admin", "staff"), getAllTicketsByStatus);

//get all tickets that are older than 14 days and still open - this is for any staff to see and handle tickets. 
router.get("/oldtickets/", routeMiddleware, authorized("admin", "staff"), getOldTickets);

// this route is for upadting the satus, however, it may not be used since we already have a route for closing the ticket, and the status can be updated to closed when the ticket is closed, so this route may not be necessary, but it can be used for updating the status to open if needed

// router.put("/updateStatus", updateStatus);

//get title for a ticket to display in the dashboard via id query parameter (ex: /gettickettitle?ticketID=12345)
router.get("/gettickettitle/", routeMiddleware, authorized("admin", "staff"), getTicketTitle);

//filter by status category - it will be a query parameter, for example, /tickets?status=open will return all open tickets, /tickets?status=closed will return all closed tickets, etc
router.get("/filter", routeMiddleware, authorized("admin", "staff"), filterTicketsByStatus);

//add a comment to a specific ticket - this means via frontend when a user clicks on the ticket, the details will be there along with an option to add a comment
router.post("/:id/comments", routeMiddleware, authorized("admin", "staff", "user"), addCommentToTicket);
router.get("/:userID",routeMiddleware, authorized("admin","staff", "user"),getAllTicketsToID);

router.get("/:id/getTicket", routeMiddleware, authorized("admin", "staff", "user"), getTicketViaID);
//delete a ticket via id
router.delete("/delete/:id", routeMiddleware, authorized("admin", "staff"), deleteTicketViaID);
module.exports = router;