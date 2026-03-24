import "dotenv/config";

import express, { json } from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import departmentRoutes from "./routes/departments.js";
import positionRoutes from "./routes/positions.js";

const app = express();
const port = process.env.API_PORT;

app.use(cors());
app.use(json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/positions", positionRoutes);
app.use("/auth", authRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
