import { Op, Sequelize } from "sequelize";
import db from "../models/index.js";

const { User } = db;

// User Discovery: Browse Profiles with Filters
export const userDiscovery = async (req, res) => {
  try {
    const { role, skills, interests } = req.query;

    // Get the current user's ID from the token (extracted in authMiddleware)
    const currentUserId = req.user.id;

    // Build dynamic query based on filters
    const whereClause = {
      id: { [Op.ne]: currentUserId }, // Exclude current user
    };

    // Role Filter: Include all roles if "All" or not provided
    if (!role || role.toLowerCase() === "all") {
      whereClause.role = { [Op.or]: ["mentor", "mentee"] };
    } else {
      whereClause.role = role;
    }

    // Optional Skills Filter (only if provided)
    if (!!skills) {
      const skillsArray = skills.split(",").map((s) => s.trim().toLowerCase());
      whereClause.skills = {
        [Op.or]: skillsArray.map((skill) =>
          Sequelize.literal(`JSON_CONTAINS(LOWER(skills), '"${skill}"', '$')`)
        ),
      };
    }

    // Optional Interests Filter (only if provided)
    if (!!interests) {
      const interestsArray = interests
        .split(",")
        .map((i) => i.trim().toLowerCase());
      whereClause.interests = {
        [Op.or]: interestsArray.map((interest) =>
          Sequelize.literal(
            `JSON_CONTAINS(LOWER(interests), '"${interest}"', '$')`
          )
        ),
      };
    }

    // Fetch users based on filters
    const users = await User.findAll({
      where: whereClause,
      attributes: ["id", "name", "role", "skills", "interests", "bio"],
    });

    // Send response
    res.status(200).json({ message: "Users fetched successfully.", users });
  } catch (error) {
    console.error("Error in User Discovery:", error.message);
    res.status(500).json({ error: "Failed to fetch users." });
  }
};
