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

const validateID = (ticketID) => {
  if (!ticketID || typeof ticketID !== "number") {
    return {
      isValid: false,
      message: "Ticket ID is required"
    };
  }
  return { isValid: true };
};

const validateFilterStatus = (status) => {
  if (!status || typeof status !== "string" || !["open", "closed", "claimed"].includes(status.toLowerCase())) {
    return { isValid: false, message: "Status filter must be 'open', 'closed', or 'claimed'" };
  }  
  return { isValid: true };
};

const validateEmail = (email) => {
    return email
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

module.exports = {
  validateCreateTicket,
  validateAssignTicket,
  validateUpdateStatus,
  validateID,
  validateFilterStatus,
  validateEmail
};
