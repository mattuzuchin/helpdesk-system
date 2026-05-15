// Validation utility functions for ticket routes

const validateCreateTicket = (title, description) => {
  if (!title || !description) {
    return {
      isValid: false,
      message: "Title and description are required"
    };
  }
  return { isValid: true };
};

const validateCloseTicket = (ticketID) => {
  if (!ticketID || typeof ticketID !== "number") {
    return {
      isValid: false,
      message: "Ticket ID is required"
    };
  }
  return { isValid: true };
};

const validateAssignTicket = (ticketID, agentID) => {
  if (!ticketID || !agentID || typeof ticketID !== "number" || typeof agentID !== "number") {
    return {
      isValid: false,
      message: "Ticket ID and Agent ID are required"
    };
  }
  return { isValid: true };
};

const validateUpdateStatus = (ticketID, statusChange) => {
  if (!ticketID || typeof ticketID !== "number" || !statusChange || typeof statusChange !== "string" || !["open", "closed"].includes(statusChange.toLowerCase())) {
    return {
      isValid: false,
      message: "Ticket ID and status change are required"
    };
  }
  return { isValid: true };
};

module.exports = {
  validateCreateTicket,
  validateCloseTicket,
  validateAssignTicket,
  validateUpdateStatus
};
