const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors({
  origin: "https://helpdesk-frontend-sjje.vercel.app/",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use("/tickets", require("./server/routes/ticketRoutes"));
app.use("/auth", require("./server/routes/authRoutes"));
app.use("/users", require("./server/routes/userRoutes"));
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});
