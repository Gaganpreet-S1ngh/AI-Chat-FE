import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store for uploaded files to demonstrate full-stack persistence
interface UserFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

let uploadedFiles: UserFile[] = [
  { id: "1", name: "Project_Brief_Q4.pdf", size: "1.4 MB", uploadedAt: "Uploaded 2 days ago" },
  { id: "2", name: "Design_Mockup_v2.png", size: "8.2 MB", uploadedAt: "Uploaded 5 days ago" }
];

// Lazy initialization of Gemini API
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined in environment variables.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// REST APIs
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// File management APIs
app.get("/api/files", (req, res) => {
  res.json(uploadedFiles);
});

app.post("/api/files", (req, res) => {
  const { name, size } = req.body;
  if (!name || !size) {
    return res.status(400).json({ error: "File name and size are required." });
  }
  const newFile: UserFile = {
    id: Date.now().toString(),
    name,
    size,
    uploadedAt: "Uploaded just now"
  };
  uploadedFiles.unshift(newFile);
  res.json(newFile);
});

app.delete("/api/files/:id", (req, res) => {
  const { id } = req.params;
  uploadedFiles = uploadedFiles.filter(f => f.id !== id);
  res.json({ success: true, id });
});

// Gemini Interactive API call
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history, engine, systemInstruction, enableSearchGrounding } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message input is required" });
    }

    const ai = getGeminiClient();
    
    // Choose model
    const selectedModel = engine === "pro" ? "gemini-3.1-pro-preview" : "gemini-3.5-flash";
    
    // Set up chat contents or list contents
    // Let's usegenerateContent with the conversation history and current turn.
    // Standard format for contents in generation parameter lists is:
    // parts, or just a string, or message list structure
    // Let's keep it simple and robust by constructing contents representing user-assistant history.
    const contents: any[] = [];
    
    if (history && Array.isArray(history)) {
      history.forEach((h: { role: string; content: string }) => {
        contents.push({
          role: h.role === "user" ? "user" : "model",
          parts: [{ text: h.content }]
        });
      });
    }
    
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });

    const config: any = {
      systemInstruction: systemInstruction || "You are DeepThink AI, a sophisticated intelligence assistant with advanced reasoning capabilities. Keep replies crisp and clear.",
    };

    if (enableSearchGrounding) {
      config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config,
    });

    const text = response.text || "No output generated.";
    
    // Extract search grounding metadata if available
    let sources: { title: string; url: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      sources = chunks
        .filter((c: any) => c.web && c.web.uri)
        .map((c: any) => ({
          title: c.web.title || c.web.uri,
          url: c.web.uri
        }));
    }

    res.json({
      text,
      sources,
      model: selectedModel
    });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ 
      error: error.message || "An unexpected error occurred while communicating with Gemini." 
    });
  }
});

// Vite middleware for development or fallback in production
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch(err => {
  console.error("Failed to start server:", err);
});
