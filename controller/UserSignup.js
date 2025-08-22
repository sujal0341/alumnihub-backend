// controllers/UserSignupController.js
const User = require("../models/userModel"); // For students
const Alumni = require("../models/alumniModel"); // For alumni
const bcrypt = require("bcryptjs");
// const { sendMail } = require("./helpers/sendMail"); // Uncomment if email verification is implemented

async function UserSignupController(req, res) {
  try {
    console.log(req.body);
    const {
      email,
      password,
      name,
      role,
      profilePictureUrl, // Frontend sends this; mapped to profileImage for alumni
      expertise,
      company,
      college,
      interests,
    } = req.body;

    // Validate required fields for all users
    if (!email || !password || !name || !role) {
      return res.status(400).json({
        error: "Please provide email, password, name, and role",
        error: true,
        success: false,
      });
    }

    // Validate role
    if (!["student", "alumni"].includes(role)) {
      return res.status(400).json({
        error: "Role must be either 'student' or 'alumni'",
        error: true,
        success: false,
      });
    }

    // Select model based on role
    const Model = role === "student" ? User : Alumni;

    // Check if user/alumni already exists
    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
        error: true,
        success: false,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return res.status(500).json({
        error: "Error in hashing password",
        error: true,
        success: false,
      });
    }

    // Prepare payload based on role
    let payload;
    if (role === "student") {
      payload = {
        name,
        email,
        password: hashedPassword,
        role,
        profilePictureUrl: profilePictureUrl || "", // Matches UserModel default
        bio: req.body.bio || "New user profile",
        about: req.body.about || "",
        skills: req.body.skills || [],
        interests: req.body.interests || [],
        languages: req.body.languages || [],
        experiences: req.body.experiences || [],
        projects: req.body.projects || [],
        education: req.body.education || [],
        certifications: req.body.certifications || [],
      };
    } else {
      // Alumni payload (matches AlumniModel.js with optional fields)
      payload = {
        name,
        email,
        password: hashedPassword,
        role,
        profileImage: profilePictureUrl || "https://res.cloudinary.com/dsujse28c/image/upload/v1738330353/OIG1_yps2rt.jpg", // Maps profilePictureUrl to profileImage
        expertise: expertise || "", // Optional, defaults to empty string
        company: company || "", // Optional, defaults to empty string
        college: college || "", // Optional, defaults to empty string
        skills: req.body.skills || (expertise ? [expertise] : []), // Use expertise if provided, else empty
        interests: interests || [], // Optional, defaults to empty array
        bio: req.body.bio || "New alumni profile",
        contact: req.body.contact || { email: "", phone: "" },
        experiences: req.body.experiences || (company ? [{ title: "Current Role", company, description: "Current employment" }] : []),
        education: req.body.education || (college ? [{ institution: college, description: "Alumni education" }] : []),
        achievements: req.body.achievements || [],
        studentsConnected: req.body.studentsConnected || 0,
        verified: req.body.verified || false,
      };
    }

    // Create and save user/alumni
    const user = new Model(payload);
    const savedUser = await user.save();

    // Optionally send verification email (uncomment if implemented)
    // await sendMail(email, "Welcome to AlumniHub", `Hello ${name}, your account has been created successfully!`);

    res.status(201).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        profileImage: savedUser.profileImage || savedUser.profilePictureUrl, // Handle both schemas
      },
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({
      error: error.message,
      error: true,
      success: false,
    });
  }
}

module.exports = UserSignupController;