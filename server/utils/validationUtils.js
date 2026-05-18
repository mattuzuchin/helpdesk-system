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

const isNumberProvided = (num) => {
    return num !== undefined && num !== null;
} 
const isValidPassword = (password) => {
    if (password.length < 15) {
        return false;
    }
    // eslint-disable-next-line no-useless-escape
    const testSpecial = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
    let sum = 0;
    let isNum = false;
    let hasSpecialChar = false;
    for (const char of password) {
        if (
            isNumberProvided(parseInt(char)) &&
            !isNaN(parseInt(char))
        ) {
            sum = parseInt(char) + sum;
            isNum = true;
        } else if (testSpecial.test(char)) {
            hasSpecialChar = true;
        }
    }
    return isNum && hasSpecialChar && sum === 20;
};
const validateAssignTicket = (ticketID, agentID) => {
  if (!ticketID || !agentID || typeof ticketID !== "string" || typeof agentID !== "string") {
    return {
      isValid: false,
      message: "Ticket ID and Agent ID are required"
    };
  }
  return { isValid: true };
};

const validateUpdateStatus = (ticketID, statusChange) => {
  if (!ticketID || typeof ticketID !== "string" || !statusChange || typeof statusChange !== "string" || !["open", "closed"].includes(statusChange.toLowerCase())) {
    return {
      isValid: false,
      message: "Ticket ID and status change are required"
    };
  }
  return { isValid: true };
};

const validateID = (ticketID) => {
  if (!ticketID || typeof ticketID !== "string") {
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

const validateRole = (role) => {
    return ["user", "staff", "admin"].includes(role.toLowerCase());
};

module.exports = {
  validateCreateTicket,
  validateAssignTicket,
  validateUpdateStatus,
  validateID,
  validateFilterStatus,
  validateEmail,
  validateRole,
  isValidPassword
};
