import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../models/index.js";

const { User } = db;

// const JWT_SECRET = process.env.JWT_SECRET;
// console.log("JWT_SECRET:", JWT_SECRET);

// Register User
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
    // console.log("JWT_SECRET at token generation:", JWT_SECRET);

    // Generate a simple token (no expiry)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );
    console.log("test token :", token);
    res.status(201).json({
      message: "User registered successfully.",
      token, // Return the token for immediate use
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register user." });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found." });

    const isPasswordValid = await bcrypt.compare(password, user.password); // Compare passwords
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid credentials." });

    // Generate a simple token (no expiry)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET
    );

    res.json({
      token, // Return the token to the client
      message: "Login successful.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to login." });
  }
};
