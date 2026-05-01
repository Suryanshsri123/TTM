const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// 🔥 ADD THESE TWO LINES (Step 2)
const crypto = require("crypto");
global.crypto = crypto;

// 🔥 MODIFY THIS LINE (Step 1)
dotenv.config({ override: true });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const projectRoutes = require("./routes/projectRoutes");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});