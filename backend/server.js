const express = require("express");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 7000;

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Test" });
});

// Routes
app.use("/api/users", require("./routes/userRoutes"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
