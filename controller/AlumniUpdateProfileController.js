const Alumni = require("../models/alumniModel");

const AlumniUpdateProfileController = async (req, res) => {
  try {
    // Extract userId and profileData from request body
    const { userId, profileData } = req.body;
    console.log("Received userId:", userId);
    console.log("Received profileData:", profileData);

    // Validate that userId and profileData are provided
    if (!userId || !profileData) {
      return res.status(400).json({
        success: false,
        message: "User ID and profile data are required",
      });
    }

    // Update the alumni profile in the database
    const updatedAlumni = await Alumni.findByIdAndUpdate(
      userId,
      { $set: profileData }, // Use $set to update only provided fields
      { new: true, runValidators: true } // Return updated document and validate schema
    );

    // Check if alumni exists
    if (!updatedAlumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    // Return the updated profile
    res.status(200).json({
      success: true,
      message: "Alumni profile updated successfully",
      data: updatedAlumni,
    });
  } catch (error) {
    console.error("Error updating alumni profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating alumni profile",
      error: error.message,
    });
  }
};

module.exports = AlumniUpdateProfileController;