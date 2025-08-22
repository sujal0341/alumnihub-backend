const natural = require('natural');
const Alumni = require('../models/alumniModel'); // Import the Alumni model

// Function to calculate Jaccard similarity between two arrays or strings
const jaccardSimilarity = (set1, set2) => {
  const array1 = Array.isArray(set1) ? set1 : (set1 ? set1.split(" ") : []);
  const array2 = Array.isArray(set2) ? set2 : (set2 ? set2.split(" ") : []);
  const s1 = new Set(array1);
  const s2 = new Set(array2);
  const intersection = new Set([...s1].filter(x => s2.has(x)));
  const union = new Set([...s1, ...s2]);
  return union.size === 0 ? 0 : intersection.size / union.size; // Handle empty sets
};

// Function to calculate match score between student and alumni profiles
const calculateMatchScore = (student, alumnus) => {
  const expertiseScore = jaccardSimilarity(student.expertise || "", alumnus.expertise || "");
  const skillsScore = jaccardSimilarity(student.skills || [], alumnus.skills || []);
  const interestsScore = jaccardSimilarity(student.interests || [], alumnus.interests || []);
  
  const collegeScore = (student.college && alumnus.college && student.college === alumnus.college) ? 1 : 0;

  const matchScore = (
    0.4 * skillsScore +     // 40% weight
    0.3 * expertiseScore +  // 30% weight
    0.15 * interestsScore + // 15% weight
       
    0.15 * collegeScore     // 5% weight
  );

  return Math.round(matchScore * 100); // Convert to percentage
};

const MatchingContent = async (req, res) => {
  try {
    const { studentProfile } = req.body;

    // Validate input
    if (!studentProfile || Object.keys(studentProfile).length === 0) {
      return res.status(400).json({ error: "Student profile is required" });
    }

    // Fetch all alumni profiles from MongoDB
    const alumni = await Alumni.find({}); // Fetch all alumni documents

    if (!alumni || alumni.length === 0) {
      return res.status(404).json({ error: "No alumni found" });
    }

    // Calculate match scores for each alumni
    const matches = alumni.map(alumnus => {
      const matchScore = calculateMatchScore(studentProfile, alumnus);
      return {
        name: alumnus.name,
        role: alumnus.role,
        company: alumnus.company || "N/A", // Default if not present
        expertise: alumnus.expertise || "N/A",
        college: alumnus.college || "N/A",
        profileImage: alumnus.profileImage || "https://via.placeholder.com/150", // Default image
        studentsConnected: alumnus.studentsConnected || 0,
        verified: alumnus.verified || false,
        matchScore,
      };
    });

    // Sort matches by score in descending order
    const sortedMatches = matches.sort((a, b) => b.matchScore - a.matchScore);

    // Return top matches (e.g., top 10, adjust as needed)
    const topMatches = sortedMatches.slice(0, 10);

    res.status(200).json(topMatches);
  } catch (error) {
    console.error("Matching error:", error);
    res.status(500).json({ error: "Matching failed", details: error.message });
  }
};

module.exports = MatchingContent;