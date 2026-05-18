const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use("/tickets", require("./server/routes/ticketRoutes"));
app.use("/auth", require("./server/routes/authRoutes"));
app.use("/users", require("./server/routes/userRoutes"));

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});

app.use(express.json());