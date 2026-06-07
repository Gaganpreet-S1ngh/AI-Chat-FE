import { useState, useEffect } from "react";
import { User, ChatSession, SettingsState } from "./types";
import LoginView from "./components/LoginView";
import SignupView from "./components/SignupView";
import Sidebar from "./components/Sidebar";
import ChatView from "./components/ChatView";
import SettingsView from "./components/SettingsView";
import HelpView from "./components/HelpView";

export default function App() {
  // Authentication states
  const [currentUser, setCurrentUser] = useState<User | null>({
    fullName: "Alex Rivera",
    email: "alex.rivera@company.com",
    provider: "google",
    avatarUrl: "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg"
  });

  const [authScreen, setAuthScreen] = useState<"login" | "signup">("login");

  // App workspace states
  const [currentView, setCurrentView] = useState<"chat" | "settings" | "help">("chat");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth >= 768 : true;
  });
  const [activeSessionId, setActiveSessionId] = useState("session-2");

  // System Settings state
  const [settings, setSettings] = useState<SettingsState>({
    theme: "dark",
    language: "en",
    engine: "pro", // Pro-Titan 4.0
    streaming: true,
    enableSearchGrounding: true,
    systemInstruction: "You are DeepThink AI, a sophisticated intelligence assistant with advanced reasoning capabilities. Keep replies crisp and clear."
  });

  // Default Chat Sessions (populated with original template cases!)
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: "session-1",
      title: "Project Brainstorm",
      engine: "pro",
      messages: [
        {
          id: "m1",
          role: "user",
          content: "Hey there! Let's brainstorm our main Q4 objectives for Aether Intelligence.",
          timestamp: "02:14 PM"
        },
        {
          id: "m2",
          role: "assistant",
          content: "Absolutely, Alex! Based on current alignment models, I suggest prioritizing: \n\n1. Running **high-concurrency scaling tests** using our standardized benchmark suites.\n2. Integrating the **Google Search Grounding Engine** into standard conversations.\n3. Refining custom workspace profiles with secure server-side proxy wrappers.\n\nWhich of these would you like to drill down into first?",
          timestamp: "02:15 PM"
        }
      ]
    },
    {
      id: "session-2",
      title: "Python Debugging Help",
      engine: "standard",
      messages: [
        {
          id: "m3",
          role: "user",
          content: "Can you explain how to implement a basic neural network in Python using NumPy? Just a simple forward pass.",
          timestamp: "04:30 PM"
        },
        {
          id: "m4",
          role: "assistant",
          content: "Implementing a simple forward pass in a neural network involves a sequence of matrix multiplications and activation functions. Here's a clean implementation using only NumPy:\n\n```python\nimport numpy as np\n\ndef sigmoid(x):\n    return 1 / (1 + np.exp(-x))\n\n# Simple 2-layer network\ninput_data = np.array([0.5, 0.3])\nweights = np.random.randn(2, 4)\nbias = np.zeros(4)\n\n# Forward pass\nlayer1 = np.dot(input_data, weights) + bias\noutput = sigmoid(layer1)\n\nprint(f\"Prediction: {output}\")\n```\n\nIn this example, we define a sigmoid activation function and perform a dot product between the input and weight matrix, followed by adding the bias vector. The final output is then squashed into a range of 0 to 1.",
          timestamp: "04:31 PM"
        }
      ]
    },
    {
      id: "session-3",
      title: "Trip Planning",
      engine: "standard",
      messages: []
    }
  ]);

  // Sync settings theme class with html tag
  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.classList.remove("light-theme-support");

    if (newTheme === "light") {
      root.classList.add("light-theme-support");
    } else if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      // System choice: fallback to dark for neural feel
      root.classList.add("dark");
    }
  };

  useEffect(() => {
    handleThemeChange(settings.theme);
  }, []);

  const handleSaveSettings = (updated: SettingsState) => {
    setSettings(updated);
  };

  const handleUpdateSession = (updatedSession: ChatSession) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === updatedSession.id ? updatedSession : s))
    );
  };

  const handleNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: `New Session ${sessions.length + 1}`,
      engine: settings.engine,
      messages: []
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setAuthScreen("login");
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  // Unauthenticated screen
  if (!currentUser) {
    return (
      <div className="bg-background text-on-surface font-sans overflow-x-hidden min-h-screen flex items-center justify-center p-4 relative">
        {/* Ambient Moving Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-float"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full animate-float" style={{ animationDelay: "-2s" }}></div>
        </div>

        {authScreen === "login" ? (
          <LoginView
            onSignupToggle={() => setAuthScreen("signup")}
            onSuccess={(u) => {
              setCurrentUser(u);
              setCurrentView("chat");
            }}
          />
        ) : (
          <SignupView
            onLoginToggle={() => setAuthScreen("login")}
            onSuccess={(u) => {
              setCurrentUser(u);
              setCurrentView("chat");
            }}
          />
        )}
      </div>
    );
  }

  // Authenticated workspace
  return (
    <div className="bg-background text-on-surface font-sans min-h-screen relative flex flex-col overflow-hidden">
      
      {/* Background Refractions */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-float pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/5 blur-[120px] rounded-full animate-float pointer-events-none" style={{ animationDelay: "-3s" }}></div>
      </div>

      {/* Top Application Bar */}
      <header className="flex justify-between items-center w-full h-16 px-6 z-30 sticky top-0 backdrop-blur-xl border-b border-outline-variant/20 bg-surface/80 dark:bg-surface-dim/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="material-symbols-outlined text-on-surface-variant hover:text-on-surface p-1.5 rounded-full hover:bg-surface-container-highest focus:outline-none cursor-pointer transition-all active:scale-95 duration-200"
            title={mobileSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {mobileSidebarOpen ? "menu_open" : "menu"}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-sans font-black text-xl text-on-surface tracking-tight">DeepThink AI</span>
            <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest ml-1 shadow-sm">
              Pro
            </span>
          </div>
        </div>

        {/* Global Nav details */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <button
              onClick={() => setCurrentView("chat")}
              className={`cursor-pointer text-xs font-bold font-sans tracking-wide pb-1 outline-none ${
                currentView === "chat" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface transition-colors"
              }`}
            >
              Models
            </button>
            <button
              onClick={() => setCurrentView("settings")}
              className={`cursor-pointer text-xs font-bold font-sans tracking-wide pb-1 outline-none ${
                currentView === "settings" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface transition-colors"
              }`}
            >
              Preferences
            </button>
            <button
              onClick={() => setCurrentView("help")}
              className={`cursor-pointer text-xs font-bold font-sans tracking-wide pb-1 outline-none ${
                currentView === "help" ? "text-primary border-b-2 border-primary" : "text-on-surface-variant hover:text-on-surface transition-colors"
              }`}
            >
              Support
            </button>
          </nav>
          
          <div className="h-5 w-[1px] bg-outline-variant/30"></div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const nextTheme = settings.theme === "dark" ? "light" : "dark";
                setSettings({ ...settings, theme: nextTheme });
                handleThemeChange(nextTheme);
              }}
              className="cursor-pointer material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors p-1 rounded-full focus:outline-none"
              title="Toggle theme quick accent"
            >
              {settings.theme === "light" ? "dark_mode" : "light_mode"}
            </button>

            <button
              onClick={() => handleNewChat()}
              className="cursor-pointer bg-primary text-on-primary text-xs font-bold px-4 py-2 rounded-full hover:opacity-85 transition-opacity shadow-lg shadow-primary/10"
            >
              New Chat
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Divider */}
      <div className="flex h-[calc(100vh-64px)] overflow-hidden relative z-10 w-full">
        {/* Navigation Sidebar Drawer */}
        <Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
          user={currentUser}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={setActiveSessionId}
          onNewChat={handleNewChat}
          onSignOut={handleSignOut}
          isOpen={mobileSidebarOpen}
          onClose={() => {
            if (window.innerWidth < 768) {
              setMobileSidebarOpen(false);
            }
          }}
        />

        {/* Core Canvas Panel */}
        <main className={`flex-1 overflow-y-auto px-4 md:px-8 py-6 transition-all duration-300 ${
          mobileSidebarOpen ? "md:ml-[280px]" : "md:ml-0"
        }`}>
          {currentView === "chat" ? (
            <ChatView
              session={activeSession}
              settings={settings}
              onUpdateSession={handleUpdateSession}
            />
          ) : currentView === "settings" ? (
            <SettingsView
              settings={settings}
              onSaveSettings={handleSaveSettings}
              onThemeChange={handleThemeChange}
            />
          ) : (
            <HelpView userEmail={currentUser.email} />
          )}
        </main>
      </div>

      {/* Visual Accent Element (Decorative right footer panel) */}
      <div className="fixed bottom-10 right-10 hidden lg:block opacity-25 hover:opacity-100 transition-all duration-300 z-20">
        <div className="glass-panel p-4 rounded-2xl flex items-center gap-4 border-primary/20 shadow-xl">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary shadow-inner">
            <span className="material-symbols-outlined text-on-primary-container fill-current">auto_awesome</span>
          </div>
          <div className="pr-2">
            <p className="text-xs font-bold text-primary font-sans leading-tight">Aether Intelligent Node</p>
            <p className="text-[10px] text-on-surface-variant font-mono">Status: Connected (Vite proxy)</p>
          </div>
        </div>
      </div>

    </div>
  );
}
