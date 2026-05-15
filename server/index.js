const express = require("express");

const app = express();
app.use(express.json());
app.use("/tickets", require("./routes/ticketRoutes"));
app.use("/signin", require("./routes/signin"));
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});