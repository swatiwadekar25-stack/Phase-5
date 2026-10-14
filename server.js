
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ]
}));

// Serve frontend files and Markdown libraries
app.use("/node_modules", express.static("node_modules"));
app.use(express.static("frontend"));

// Gemini API setup
const ai = new GoogleGenAI({
    apiKey: process.env.API
});

// Ask Gemini API
app.post("/api/ask", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question || !question.trim()) {
            return res.status(400).json({
                error: "Please enter a question."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
You are a helpful AI assistant.

Answer the question in simple, clear English.

Formatting instructions:
- Use Markdown headings where appropriate.
- Use **bold** for important terms.
- Use numbered lists for steps.
- Use bullet points for examples.
- Keep paragraphs short.
- Use code blocks for programming examples.

Question: ${question}
`
        });

        const answer = response.text;

        if (!answer) {
            return res.status(502).json({
                error: "Gemini returned an empty answer."
            });
        }

        res.json({ answer });

    } catch (error) {
        console.error("Gemini API error:", error);

        res.status(500).json({
            error: "Failed to generate an answer. Please try again."
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
