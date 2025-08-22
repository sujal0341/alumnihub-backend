// controllers/AlumniFetchProfileController.js
const Alumni = require("../models/alumniModel");

const AlumniFetchProfileController = async (req, res) => {
  try {
    // Extract alumni ID from request parameters
    const {userId } = req.params;
console.log(userId)
    // Fetch alumni profile from the database
    const alumni = await Alumni.findById(userId);
// console.log(alumni)
    // Check if alumni exists
    if (!alumni) {
      return res.status(404).json({
        success: false,
        message: "Alumni not found",
      });
    }

    // Return the alumni profile
    res.status(200).json({
      success: true,
      message: "Alumni profile fetched successfully",
      data: alumni,
    });
  } catch (error) {
    console.error("Error fetching alumni profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching alumni profile",
      error: error.message,
    });
  }
};

module.exports = AlumniFetchProfileController;