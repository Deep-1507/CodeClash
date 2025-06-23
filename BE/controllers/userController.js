import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  const { name, phone, email, password, contacts } = req.body;

  if (!name || !phone || !email || !password || contacts.length !== 3) {
    return res.status(400).json({ message: "All fields required including 3 contacts" });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "User already exists" });

  const user = await User.create({ name, phone, email, password, contacts });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  res.status(201).json({
    message: "User registered",
    user: { id: user._id, name: user.name, email: user.email },
    token,
  });
};