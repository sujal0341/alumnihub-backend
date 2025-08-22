// controllers/ConnectionRequestController.js
const ConnectionRequest = require("../models/ConnectionRequestModel");

// Send a connection request
const sendConnectionRequest = async (req, res) => {
  try {
    const { studentId, alumniId } = req.body;

    const existingRequest = await ConnectionRequest.findOne({ studentId, alumniId });
    if (existingRequest) {
      return res.status(400).json({ error: "Request already sent" });
    }

    const newRequest = new ConnectionRequest({ studentId, alumniId });
    await newRequest.save();

    res.status(201).json({ message: "Connection request sent", request: newRequest });
  } catch (error) {
    console.error("Error sending connection request:", error);
    res.status(500).json({ error: "Failed to send connection request" });
  }
};

// Fetch pending connection requests for an alumni
const fetchPendingRequests = async (req, res) => {
  try {
    const { alumniId } = req.params;
    const requests = await ConnectionRequest.find({ alumniId, status: "pending" }).populate("studentId");

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({ error: "Failed to fetch pending requests" });
  }
};

// Accept or reject a connection request
const updateConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    const request = await ConnectionRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.status(200).json({ message: "Request updated", request });
  } catch (error) {
    console.error("Error updating connection request:", error);
    res.status(500).json({ error: "Failed to update connection request" });
  }
};

module.exports = { sendConnectionRequest, fetchPendingRequests, updateConnectionRequest };