import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import db from "./models/index.js"; // Import the database and models

console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Explicitly handle preflight requests
app.options("*", cors());

console.log("Allowed frontend origin:", process.env.FRONTEND_URL);

app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// API Routes
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import matchmakingRoutes from "./routes/matchmaking.js";
import mentorshipRequestRoutes from "./routes/mentorshipRequests.js";
import notificationRoutes from "./routes/notifications.js";
import discoveryRoutes from "./routes/discovery.js";

// Add routes
app.use("/api/auth", authRoutes); // User authentication routes
app.use("/api/profile", profileRoutes); // User profile management
app.use("/api/matchmaking", matchmakingRoutes); // Matchmaking routes
app.use("/api/discovery", discoveryRoutes);
app.use("/api/mentorship-requests", mentorshipRequestRoutes); // Mentorship request routes
app.use("/api/notifications", notificationRoutes); // Notifications

// Serve React build folder
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "build")));

// Catch-all for React Router
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Sync database and start server
db.sequelize
  .sync({ alter: true }) // Alter tables to match models without dropping data
  .then(() => {
    console.log("Database synced successfully.");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT} `);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
