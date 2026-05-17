// all controller code (the logic of endpoints)
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const validation = require("../utils/validationUtils.js");

const getAllTickets = async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany();
        res.status(200).json({
            tickets
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching tickets"
        });
    }
};

const createTicket = async (req, res) => {
  const { title, description, name } = req.body;
  // Validation
  const validationResult = validation.validateCreateTicket(title, description);
  if (!validationResult.isValid) {
    return res.status(400).json({
      message: validationResult.message
    });
  }
  try {
    const newTicket = await prisma.ticket.create({
      data: {
        title: title,
        description: description,
        status: "open",
        openDate: new Date().toISOString(),
        closeDate: null,
        assignedTo: null
      }
    });
    return res.status(201).json({
      message: "Ticket creation was successful",
      ticketCreated: newTicket
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create ticket"
    });
  }
};

const closeTicket = async (req, res) => {
  const ticketID = parseInt(req.params.id);

  const validationResult = validation.validateID(ticketID);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketID }
    });

    if (!ticket || ticket.status === "closed") {
      return res.status(404).json({
        message: "Ticket not found or already closed"
      });
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketID },
      data: {
        status: "closed",
        closeDate: new Date()
      }
    });

    res.status(200).json({
      message: "Ticket closed successfully",
      ticketID: updated.id,
      status: updated.status,
      closeDate: updated.closeDate
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const assignTicket = async (req, res) => {
  const ticketID = parseInt(req.params.ticketID);
  const { agentID } = req.body;

  const validationResult = validation.validateAssignTicket(ticketID, agentID);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketID }
    });

    if (!ticket || ticket.status === "closed" || ticket.status === "claimed") {
      return res.status(404).json({ message: "Ticket not found or already closed  or claimed- thus it cannot be assigned. " });
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketID },
      data: {
        assignedTo: agentID,
        status: "claimed"
      }
    });

    res.status(200).json({
      message: "Ticket assigned successfully",
      ticketID: updated.id,
      assignedTo: updated.assignedTo,
      status: updated.status
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllTicketsByAgent = async (req, res) => {
  const agentID = parseInt(req.query.agentID);

  const validationResult = validation.validateID(agentID);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: { assignedTo: agentID }
    });

    res.status(200).json({ tickets });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const getAllTicketsByStatus = async (req, res) => {
  const agentID = parseInt(req.query.agentID);
  const status = req.query.status;

  const idValidation = validation.validateID(agentID);
  if (!idValidation.isValid) {
    return res.status(400).json({ message: idValidation.message });
  }

  const statusValidation = validation.validateFilterStatus(status);
  if (!statusValidation.isValid) {
    return res.status(400).json({ message: statusValidation.message });
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        assignedTo: agentID,
        status: status
      }
    });

    res.status(200).json({ tickets });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const getOldTickets = async (req, res) => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 14);

    const tickets = await prisma.ticket.findMany({
      where: {
        status: "open",
        openDate: {
          lt: cutoffDate
        }
      }
    });

    res.status(200).json({ tickets });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//const updateStatus = async(req, res) => {
//   const  { ticketID, statusChange }  = req.body;
//   const validationResult = validation.validateUpdateStatus(ticketID, statusChange);
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
// };

const getTicketTitle = async (req, res) => {
  const ticketID = parseInt(req.query.ticketID);

  const validationResult = validation.validateID(ticketID);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketID }
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.status(200).json({ title: ticket.title });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const filterTicketsByStatus = async (req, res) => {
  const status = req.query.status;

  const validationResult = validation.validateFilterStatus(status);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: { status }
    });

    res.status(200).json({ tickets });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addCommentToTicket = async (req, res) => {
  const ticketID = parseInt(req.params.id);
  const { comment } = req.body;

  const validationResult = validation.validateID(ticketID);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketID }
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketID },
      data: {
        comments: {
          push: comment
        }
      }
    });

    res.status(200).json({
      message: "Comment added successfully",
      ticket: updated
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTicketViaID = async (req, res) => {
  const ticketID = parseInt(req.params.id);
  const validationResult = validation.validateID(ticketID);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  } 
  try {
    const ticket = await prisma.ticket.findUnique({
    where: { id: ticketID }
    });  
    if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
    }
    await prisma.ticket.delete({
        where: { id: ticketID }
    });
    res.status(200).json({ message: "Ticket deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
module.exports = {
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
};