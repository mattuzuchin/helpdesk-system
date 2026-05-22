const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors({
  origin: ['https://helpdesk-frontend-sjje.vercel.app', 'https://helpdesk-frontend-gamma-nine.vercel.app/'],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use("/tickets", require("./server/routes/ticketRoutes"));
app.use("/auth", require("./server/routes/authRoutes"));
app.use("/users", require("./server/routes/userRoutes"));
app.get("/", (req, res) => {
  res.send("Hello World");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
