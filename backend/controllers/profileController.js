import db from "../models/index.js";

const { User } = db;

// Check Profile Status
export const checkProfileStatus = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from the token
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const isProfileComplete =
      user.name && user.role && user.skills && user.interests && user.bio;

    res.status(200).json({
      profileComplete: !!isProfileComplete,
    });
  } catch (error) {
    console.error("Error checking profile status:", error.message);
    res.status(500).json({ error: "Failed to check profile status." });
  }
};

// Get User Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch profile." });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  const { skills, interests, bio } = req.body;

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    await user.update({ role, skills, interests, bio });
    res.json({ message: "Profile updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile." });
  }
};
