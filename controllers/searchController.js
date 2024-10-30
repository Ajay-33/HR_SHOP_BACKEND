import OpenAI from "openai";
import dotenv from "dotenv";
import usermodel from "../models/usermodel.js";
dotenv.config();
const openai = new OpenAI({
  apiKey: process.env.GPT_SECRET,
});

export const searchGPT = async (req, res, next) => {
  const { sentence } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI trained to extract specific keywords and correct the spellings if they are wrong from sentences and return them in a valid JSON object.",
        },
        {
          role: "user",
          content: `Extract the following information from this sentence: location, degree, job title (include all related job titles), experience year(if string convert to number), gender, and skills(array of skills). For the job title, include the primary job title and a list of all related job titles that could be associated with it. For example, if the sentence mentions "Backend Developer," related job titles might include "Backend Engineer," "Software Developer," "Full Stack Developer," etc. The sentence is: '${sentence}'. Provide the extracted information as a JSON object in the following format: {"location": [location], "job titles": [primary job title, related job title1, related job title2, ...], "education": [degree], "experience year": [experience year], "skills": [skill1,skill2,...], "gender": [gender]}. Please include all relevant related job titles in the array and no other text.`,
        },
      ],
      max_tokens: 100, // Increased token limit to ensure longer responses
      temperature: 0.3,
    });

    if (response.choices && response.choices.length > 0) {
      const extractedInfo = response.choices[0].message.content.trim();
      res.json({ extractedInfo });
    } else {
      res.status(500).json({ error: "No response from OpenAI API" });
    }
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ error: "Error extracting keywords" });
  }
};

export const addSearch = async (req, res, next) => {
  const { searchName } = req.body;
  const userId = req.user?.userId; // Ensure userId is defined

  // Log userId for debugging
  console.log("User ID:", userId);
  
  try {
    // Find the user by ID
    const user = await usermodel.findById(userId);
    
    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the search already exists for this user
    const existingSearch = user.searches.find((s) => s.searchName === searchName);
    if (existingSearch) {
      return res.status(400).json({ message: "Search name already exists." });
    }

    // Add new search to the user's searches array
    user.searches.push({
      searchName,
      previousSearchContent: [],
      shortlistedCandidates: [],
    });

    // Save updated user document
    await user.save();

    res.status(201).json({
      message: "Search added successfully",
      searches: user.searches,
    });
  } catch (error) {
    console.error("Error in addSearch:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserSearches = async (req, res) => {
  const userId = req.user.userId; 
  console.log(userId);
  try {
    const user = await usermodel.findById(userId).select("searches");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.searches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

