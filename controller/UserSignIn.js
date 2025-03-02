const User=require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
async function UserSignInController(req,res){
try{
    const { email, password,role } = req.body;

    // Check for missing fields
    if (!email || !password || !role) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
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
      profilePictureUrl:user?.profilePictureUrl,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    // Cookie options
    const tokenOption = {
      secure: true,
      httpOnly: true, 
      sameSite: 'None' ,
      maxAge: 8 * 60 * 60 * 1000, 
    };
    return res.cookie("token", token, tokenOption).status(200).json({
        message: "Login successful",
        success: true,
        error: false,
        role,token,user
      });
}
catch (error) {
    return res.status(500).json({ error: error.message });
}
}
module.exports = UserSignInController;