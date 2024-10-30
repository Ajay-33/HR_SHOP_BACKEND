import usermodel from "../models/usermodel.js";

export const updateCandidateStatus = async (req, res) => {
  const userId = req.user.userId; // Extract user ID from auth middleware
  const { searchId, candidateId } = req.params; // Get searchId and candidateId from URL parameters
  const { status } = req.body; // New status from request body

  console.log("UserId:", userId);
  console.log("SearchId:", searchId);
  console.log("CandidateId:", candidateId);
  console.log("New Status:", status);

  try {
    // Find the user by userId
    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the specific search within the user's searches array by searchId
    const search = user.searches.id(searchId);
    if (!search) {
      return res.status(404).json({ message: "Search not found" });
    }

    // Find the candidate in the shortlistedCandidates array by candidateId
    const candidate = search.shortlistedCandidates.id(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found in this search" });
    }

    // Update the status of the candidate
    candidate.status = status;

    // Save changes
    await user.save();
    res.status(200).json({ message: "Candidate status updated successfully", candidate });
  } catch (error) {
    console.error("Error updating candidate status:", error);
    res.status(500).json({ message: "Server error" });
  }
};
