const User = require('../models/userModel');

async function UserFetchProfileController(req, res) {
    try {
        // Extract userId from the URL parameters
        const { userId } = req.params;

        // Find the user in the database by their userId
        const user = await User.findById(userId);

        // If the user does not exist, return a 404 error
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user's profile as a JSON response
        return res.json(user);
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error fetching user profile:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports = UserFetchProfileController;
