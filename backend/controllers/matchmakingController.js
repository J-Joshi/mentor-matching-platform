import { Op, Sequelize } from "sequelize";
import db from "../models/index.js";

const findMatches = async (req, res) => {
  try {
    const currentUser = req.user;

    // Step 1: Fetch the user by ID
    const user = await db.User.findByPk(currentUser.id);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { role, skills, interests } = user;

    // Step 2: Validate required fields
    if (!role || !skills || !interests) {
      return res
        .status(400)
        .json({ error: "Role, skills, and interests are required." });
    }

    // Step 3: Parse and normalize skills/interests (if stored as JSON string)

    const lowerSkills = skills.map((skill) => skill.toLowerCase());
    const lowerInterests = interests.map((interest) => interest.toLowerCase());

    // const lowerSkills = JSON.parse(skills).map((skill) => skill.toLowerCase());
    // const lowerInterests = JSON.parse(interests).map((interest) =>
    //   interest.toLowerCase()
    // );

    // Step 4: Determine the opposite role
    const targetRole = role === "mentor" ? "mentee" : "mentor";

    // Step 5: Fetch matches with case-insensitive skill/interests overlap
    const matches = await db.User.findAll({
      where: {
        role: targetRole, // Match users with opposite role
        [Op.or]: [
          // Match skills (case-insensitive)
          {
            [Op.or]: lowerSkills.map((skill) =>
              Sequelize.where(Sequelize.fn("LOWER", Sequelize.col("skills")), {
                [Op.like]: `%${skill}%`,
              })
            ),
          },
          // Match interests (case-insensitive)
          {
            [Op.or]: lowerInterests.map((interest) =>
              Sequelize.where(
                Sequelize.fn("LOWER", Sequelize.col("interests")),
                { [Op.like]: `%${interest}%` }
              )
            ),
          },
        ],
      },
      attributes: ["id", "name", "role", "skills", "interests", "bio"], // Fields to include in response
    });

    // Step 6: Send response with matched users
    res.status(200).json({
      message: "Matches found successfully.",
      matches,
    });
  } catch (error) {
    console.error("Error fetching matches:", error.message);
    res.status(500).json({ error: "Failed to fetch matches." });
  }
};

export default findMatches;
