import OpenAI from "openai";
import dotenv from "dotenv";
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
            "You are an AI trained to extract specific keywords from sentences.",
        },
        {
          role: "user",
          content: `Extract the following keywords from this sentence: location, job title, experience year, gender, skills. The sentence is: '${sentence}'. Provide the extracted information in the following format: location: [location], job title: [job title], experience year: [experience year], skills: [skills] gender: [gender].`,
        },
      ],
      max_tokens: 50,
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
