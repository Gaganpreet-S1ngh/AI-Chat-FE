export interface User {
  fullName: string;
  email: string;
  provider: "email" | "google" | "github";
  avatarUrl: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  sources?: { title: string; url: string }[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  engine: "standard" | "pro";
  systemInstruction?: string;
  enableSearchGrounding?: boolean;
}

export interface UserFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
}

export interface SettingsState {
  theme: "light" | "dark" | "system";
  language: string;
  engine: "standard" | "pro";
  streaming: boolean;
  enableSearchGrounding: boolean;
  systemInstruction: string;
}
