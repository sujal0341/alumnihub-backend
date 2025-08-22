const User = require('../models/userModel'); // For students
const Alumni = require('../models/alumniModel'); // For alumni
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

async function UserSignInController(req, res) {
  try {
    const { email, password, role } = req.body;

    // Check for missing fields
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Validate role
    if (!["student", "alumni"].includes(role)) {
      return res.status(400).json({ message: "Role must be either 'student' or 'alumni'" });
    }

    // Select model based on role
    const Model = role === "student" ? User : Alumni;

    // Find user/alumni by email
    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: `${role.charAt(0).toUpperCase() + role.slice(1)} not found` });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const tokenData = {
      email: user.email,
      id: user._id,
      profilePicture: user.profilePictureUrl || user.profileImage, // Handle both schemas
      role: user.role,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    // Cookie options
    const tokenOption = {
      secure: true,
      httpOnly: true,
      sameSite: 'None',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    };

    return res.cookie("token", token, tokenOption).status(200).json({
      message: "Login successful",
      success: true,
      error: false,
      role,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePictureUrl || user.profileImage, // Return appropriate field
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

module.exports = UserSignInController;