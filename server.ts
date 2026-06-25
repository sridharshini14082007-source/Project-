import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent for tracking
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Warning: GEMINI_API_KEY is not defined. Using mock roaster.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Endpoint for roasting anime taste
app.post("/api/roast", async (req, res) => {
  try {
    const { favorites, unpopularOpinion, waifu } = req.body;

    if (!favorites || !Array.isArray(favorites) || favorites.length === 0) {
      return res.status(400).json({ error: "Please provide your favorite anime!" });
    }

    const ai = getGenAIClient();

    if (!ai) {
      // Fallback response if API key is not present
      const mockRoasts = [
        "Your taste is so incredibly basic that calling it room temperature is an insult to comfortable cooling systems.",
        "A true classic case of gacha brainrot and mainstream absorption. Do you only watch what's on the front page of Crunchyroll?",
        "Watching anime has clearly warped your perception of reality. This isn't just salty taste; it's a salt mine."
      ];
      const randomMock = mockRoasts[Math.floor(Math.random() * mockRoasts.length)];
      return res.json({
        roast: `[Demo Mode - API Key Not Found] ${randomMock} (Favorite: ${favorites.join(", ")}, Waifu: ${waifu || "None"})`,
        saltinessRating: 85,
        funnyTitle: "Copium Enthusiast",
        diagnoses: ["Severe mainstream exposure", "Waifu attachment issues"],
        suggestedRemedies: ["Watch a 90s space anime immediately", "Touch actual grass"],
      });
    }

    const favoritesStr = favorites.filter(Boolean).join(", ");
    const waifuStr = waifu ? waifu : "none specified";
    const opinionStr = unpopularOpinion ? unpopularOpinion : "none specified";

    const prompt = `You are a hilariously sarcastic, witty, and extremely salty anime elitist community veteran.
Roast the user's anime taste based on the following details they provided:
- Favorite Anime: ${favoritesStr}
- Unpopular Anime Opinion: ${opinionStr}
- Favorite Waifu or Husbando: ${waifuStr}

Be witty, sarcastic, slightly dramatic, and incredibly funny. Use community slang (like copium, brainrot, mid, goated, touch grass, gacha luck, peak, mainstream, trash taste). Keep it friendly and humorous, but highly biting. Avoid any genuinely offensive or inappropriate language.

Provide your output as a single structured JSON object matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional anime roaster who outputs structured JSON analysis of users' anime tastes.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roast: {
              type: Type.STRING,
              description: "A paragraph of witty, sarcastic, and highly specific anime roasting targeting their favorites, opinion, or waifu.",
            },
            saltinessRating: {
              type: Type.INTEGER,
              description: "A score from 0 (completely chill) to 100 (lethal levels of pure NaCl).",
            },
            funnyTitle: {
              type: Type.STRING,
              description: "A highly creative and funny community archetype label or title for their profile (e.g. 'Isekai Slop Connoisseur', 'Classic Gatekeeper', 'Critical Copium Overdoser').",
            },
            diagnoses: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 or 3 funny medical/psychological symptoms of their taste (e.g., 'Acute Mainstream Overdose', 'Severe Waifu Delusion syndrome').",
            },
            suggestedRemedies: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 or 3 hilariously specific remedies or steps they can take to fix their bad taste.",
            },
          },
          required: ["roast", "saltinessRating", "funnyTitle", "diagnoses", "suggestedRemedies"],
        },
      },
    });

    const jsonText = response.text?.trim() || "{}";
    const roastResult = JSON.parse(jsonText);
    return res.json(roastResult);

  } catch (error: any) {
    console.error("Error generating roast:", error);
    return res.status(500).json({
      error: "The Salty Roaster overheated from your terrible taste. Please try again!",
      details: error.message,
    });
  }
});

// Configure Vite or Static Assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
