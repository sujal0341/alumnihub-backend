const User = require("../models/userModel");

async function UserUpdateProfileController(req, res) {
  try {
    // Destructure userId and profileData from the request body
    const { userId, profileData } = req.body;
    console.log(userId, profileData);

    // Find the user by ID in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's profile fields with the new data
    user.name = profileData.name || user.name;
    user.email = profileData.email || user.email;
    user.bio = profileData.bio || user.bio;
    user.about = profileData.about || user.about;
    user.skills = profileData.skills || user.skills;
    user.interests = profileData.interests || user.interests;
    user.languages = profileData.languages || user.languages;
    user.experiences = profileData.experiences || user.experiences;
    user.projects = profileData.projects || user.projects;
    user.education = profileData.education || user.education;
    user.certifications = profileData.certifications || user.certifications;

    // Save the updated user to the database
    const updatedUser = await user.save();

    // Return the updated user profile as the response
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ message: "Error updating user profile" });
  }
}

module.exports = UserUpdateProfileController;