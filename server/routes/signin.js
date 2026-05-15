const express = require("express");

const router = express.Router();

router.post("/", (req, res) => {
    const username = "mattuzuchin";
    const password = "password123";
    if (username === "mattuzuchin" && password === "password123") {
        res.json({ message: "Sign-in successful" });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
  res.json({
    username,
    password
  });
});

module.exports = router;