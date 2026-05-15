const tickets = [
    {
      id: 1,
      title: "Issue with login",
      description: "I can't log in to my account",
      status: "open",
      openDate: "2024-06-01T10:00:00Z",
      closeDate: null,
      openedBy: "user1",
      assignedTo: "agent1",
      closedBy: null
    },
    {
      id: 2,
      title: "Error on dashboard",
      description: "The dashboard shows an error message",
      status: "closed",
      openDate: "2024-06-01T10:00:00Z",
      closeDate: "2024-06-01T11:00:00Z",
      openedBy: "user2",
      assignedTo: "agent2",
      closedBy: "agent2"
    }
  ];
module.exports = tickets;