const express = require("express");
const port = 3001;
const app = express();
const db_pool = require("./config/db");
const cors = require("cors");

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  return res.send("Backend is working well");
});

app.use("/auth", require("./routes/Auth"));

// middleware handle

app.use((err, req, res, next) => {
  console.error("Error handler caught:", err);
  if (err.name === "UnauthorizedError") {
    return res
      .status(401)
      .json({ msg: "Invalid or missing token", error: err.message });
  }
  res.status(500).json({ msg: "Internal server error", error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
