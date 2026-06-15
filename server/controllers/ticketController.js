// all controller code (the logic of endpoints)
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
const validation = require("../utils/validationUtils.js");
const {sendTicketCreatedEmail } = require("../utils/email.js");
// display all tickets - only for staff and managers since users should only se thier own tickets
const getAllTickets = async (req, res) => {
    try {
        const tickets = await prisma.ticket.findMany({
            include: {
                assignedTo: {
                    select: { id: true, name: true, email: true }
                },
                createdBy: {
                    select: { id: true, name: true }
                }
            }
        });
        res.status(200).json({
            tickets
        });
        console.log(tickets);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching tickets"
        });
    }
};
const getAllTicketsToID = async (req, res) => {
  const userID = req.params.userID;
  const validationResult = validation.validateID(userID);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }
  try {
    const loggedInUser = req.user;
    if(loggedInUser.role === "user" && loggedInUser.id !== userID) {
      return res.status(400).json({
        message: "Not able to show tickets for other users since you do not have permissions"
      })
    }
    const tickets = await prisma.ticket.findMany({
        where: { 
          OR: [
          {createdById: userID},
          {assignedToId: userID}
        ]
        }
    }
    );
    if(tickets == null) {
          res.status(404).json({
         msg: "No tickets found for the user"
    });
    }
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
  const { title, description} = req.body;

  const userInfo = req.user;
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
        title,
        description,
        status: "open",
        openDate: new Date(),
        createdBy: {
          connect: {
            id: req.user.id
          }
        }
      },
      include: {
        createdBy: true
      }
    });

    return res.status(201).json({
      message: "Ticket creation was successful",
      ticketCreated: newTicket
    });
    await sendTicketCreatedEmail(req.user.email, newTicket.id);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create ticket"
    });
  }
};

const closeTicket = async (req, res) => {
  const ticketID = req.params.id;

  const validationResult = validation.validateID(ticketID);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }

  try {
    const tickets = await prisma.ticket.findUnique({
      where: { id: ticketID }
    });

    if (!tickets || tickets.status === "closed") {
      return res.status(404).json({
        message: "Ticket not found or already closed"
      });
    }

    const ticket = await prisma.ticket.update({
      where: { id: ticketID },
      data: {
        status: "closed",
        closeDate: new Date(),
        closedBy: {
          connect: {
            id: req.user.id
          }
        }
      },
      include: {
        closedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      ticket
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const reAssignTicket = async (req, res) => {
  const ticketID = req.params.ticketID;
  const { agentID } = req.body;

  const validationResult = validation.validateAssignTicket(ticketID, agentID);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketID }
    });
    if(ticket.assignedToId === agentID) {
        return res.status(400).json({ message: "Ticket is already assigned to this agent" });
    }
    const updated = await prisma.ticket.update({
      where: { id: ticketID },
      data: {
        status: "claimed",
        assignedTo: {
          connect: {
            id: agentID
          }
        }
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      message: "Ticket reassigned successfully",
      ticketID: updated.id,
      assignedTo: updated.assignedTo,
      status: updated.status
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const assignTicket = async (req, res) => {
  const ticketID = req.params.ticketID;
  const { agentID } = req.body;

  const validationResult = validation.validateAssignTicket(ticketID, agentID);
  if (!validationResult.isValid) {
    return res.status(400).json({ message: validationResult.message });
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketID },
    });

    if (
      !ticket ||
      ticket.status === "closed" ||
      ticket.status === "claimed"
    ) {
      return res.status(404).json({
        message:
          "Ticket not found or already closed or claimed - thus it cannot be assigned."
      });
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketID },
      data: {
        status: "claimed",
        assignedTo: {
          connect: {
            id: agentID
          }
        }
      },
      }
    );

    return res.status(200).json({
      message: "Ticket assigned successfully",
      ticket: updated
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

const getAllTicketsByAgent = async (req, res) => {
  const agentID = req.query.agentID;

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
  const agentID = req.query.agentID;
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

const reopenTicket = async (req, res) => {
  const ticketID = req.params.id;
  console.log("Reopen ticket called with ID:", ticketID);
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

    if (ticket.status !== "closed") {
      return res.status(400).json({ message: "Ticket is not closed" });
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketID },
      data: {
        status: "open",
        closeDate: null,
        closedById: null,
        assignedToId: null
      }
    });

    res.status(200).json({ message: "Ticket reopened successfully", ticket: updated });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
const getTicketTitle = async (req, res) => {
  const ticketID = req.query.ticketID;

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
  const ticketID = req.params.id;
  const { content, imageUrl } = req.body;
  try {
        
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketID }
    });
    if(content.trim().length === 0) {
      return res.status(404).json({
        message: "Comment cannot be empty!"
      });
    }
    if(imageUrl && !validation.validateLink(imageUrl)) {
      return res.status(404).json({
        message: "Link format is invalid. Please enter a valid link."
      });
    }
    if (!ticket) {
      return res.status(404).json({
        message: "Ticket not found"
      });
    }
    const newComment = await prisma.comment.create({
      data: {
        content: content,
        imageUrl: imageUrl || null,
        ticket: {
          connect: {
            id: ticketID
          }
        },
        user: {
          connect: {
            id: req.user.id
          }
        }
      }
    });
    return res.status(201).json({
      message: "Comment added successfully",
      comment: newComment
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error"
    });

  }
};

const deleteTicketViaID = async (req, res) => {
  const ticketID = req.params.id;
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

const getTicketViaID = async (req, res) => {
    const ticketID = req.params.id;
    const validationResult = validation.validateID(ticketID);
    if (!validationResult.isValid) {
      return res.status(400).json({ message: validationResult.message });
    } 
    try {
        const ticket = await prisma.ticket.findMany(
          {
            where: {id: ticketID},
            include: {createdBy: true, assignedTo: true, closedBy: true, comments: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
              }  
            }
          }
        }
      }
        );
        return res.status(200).json({
            ticket
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching tickets"
        });
    }
};

const deleteCommentViaID = async (req, res) => {
    const commentID = req.params.id;
    const validationResult = validation.validateID(commentID);
    if (!validationResult.isValid) {
      return res.status(400).json({ message: validationResult.message });
    }
    try {
      const comment = await prisma.comment.findUnique({
        where: { id: commentID }
      });
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      await prisma.comment.delete({
        where: { id: commentID }
      });
      res.status(200).json({ message: "Comment deleted successfully" });
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
    deleteTicketViaID,
    reAssignTicket,
    getAllTicketsToID,
    getTicketViaID,
    deleteCommentViaID,
    reopenTicket
};