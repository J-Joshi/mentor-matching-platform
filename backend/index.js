import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./models/index.js"; // Import the database and models

console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

const app = express();

const allowedOrigins = [
  "https://mentor-matching-platform-pi9d.vercel.app", // Frontend URL
  "http://localhost:3000", // Add localhost for development
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true, // Allow cookies and authentication headers
  })
);

// Explicitly handle preflight requests
app.options("*", cors());

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

// Sync database and start server
db.sequelize
  .sync({ alter: true }) // Alter tables to match models without dropping data
  .then(() => {
    console.log("Database synced successfully.");
    app.listen(5001, () => {
      console.log("Server is running on port 5001");
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });
