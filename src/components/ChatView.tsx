import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { ChatSession, ChatMessage, SettingsState } from "../types";

interface ChatViewProps {
  session: ChatSession;
  settings: SettingsState;
  onUpdateSession: (updated: ChatSession) => void;
}

export default function ChatView({ session, settings, onUpdateSession }: ChatViewProps) {
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [micActive, setMicActive] = useState(false);
  const [evals, setEvals] = useState<Record<string, "up" | "down" | null>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on updates
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.messages, isLoading]);

  // Handle message sending to full-stack backend Express-Gemini route
  const handleSend = async (textToSend?: string) => {
    const finalPrompt = textToSend || inputText;
    if (!finalPrompt.trim() || isLoading) return;

    // Create user message object
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: finalPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    const updatedMessages = [...session.messages, userMessage];
    
    // Update parent session with user prompt instantly
    onUpdateSession({
      ...session,
      messages: updatedMessages
    });

    setInputText("");
    setIsLoading(true);

    try {
      // Create user-assistant history log
      const historyLog = updatedMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: finalPrompt,
          history: historyLog,
          engine: settings.engine,
          systemInstruction: settings.systemInstruction,
          enableSearchGrounding: settings.enableSearchGrounding
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate AI response.");
      }

      // Create model message object
      const modelMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        sources: data.sources
      };

      // Set session title if it was "New Conversation..." or empty
      let updatedTitle = session.title;
      if (session.title.startsWith("New Session") || session.title.startsWith("New Conversation") || updatedMessages.length <= 2) {
        updatedTitle = finalPrompt.length > 25 ? finalPrompt.substring(0, 25) + "..." : finalPrompt;
      }

      onUpdateSession({
        ...session,
        title: updatedTitle,
        messages: [...updatedMessages, modelMessage]
      });

    } catch (err: any) {
      console.error(err);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ Error: ${err.message || "An unexpected error occurred while communicating with Gemini. Please check your secrets configuration."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      onUpdateSession({
        ...session,
        messages: [...updatedMessages, errorMessage]
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Safe manual code formatter & parser
  const renderMessageContent = (content: string) => {
    // Basic formatting for triple backticks code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith("```") && part.endsWith("```")) {
        // Parse out language & code
        const raw = part.slice(3, -3);
        const match = raw.match(/^([a-zA-Z0-9+#-]+)?\n([\s\S]*)$/);
        const language = match ? match[1] || "code" : "code";
        const code = match ? match[2] : raw;

        return (
          <div key={index} className="code-container my-3.5 shadow-md">
            <div className="flex justify-between items-center mb-2 text-xs text-on-surface-variant border-b border-outline-variant/20 pb-1.5 font-mono">
              <span className="capitalize">{language}</span>
              <button
                onClick={() => handleCopy(code, `${index}`)}
                className="cursor-pointer flex items-center gap-1 hover:text-primary transition-colors text-xs focus:outline-none"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {copiedId === `${index}` ? "check" : "content_copy"}
                </span>
                <span>{copiedId === `${index}` ? "Copied" : "Copy"}</span>
              </button>
            </div>
            <pre className="font-mono text-xs text-primary overflow-x-auto whitespace-pre p-1">
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }

      // Inline code highlights
      const inlineParts = part.split(/(`[^`\n]+`)/g);
      return (
        <span key={index} className="whitespace-pre-line leading-relaxed font-sans text-sm">
          {inlineParts.map((sub, sIdx) => {
            if (sub.startsWith("`") && sub.endsWith("`")) {
              return (
                <code key={sIdx} className="bg-surface-container px-1.5 py-0.5 rounded text-xs font-mono text-primary font-semibold mx-0.5">
                  {sub.slice(1, -1)}
                </code>
              );
            }
            return sub;
          })}
        </span>
      );
    });
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleMicToggle = () => {
    if (micActive) {
      setMicActive(false);
    } else {
      setMicActive(true);
      // Simulate input voice
      setTimeout(() => {
        setInputText("Optimize this sigmoid calculation for high concurrency execution.");
        setMicActive(false);
      }, 2200);
    }
  };

  const handleEval = (msgId: string, rating: "up" | "down") => {
    setEvals((prev) => ({
      ...prev,
      [msgId]: prev[msgId] === rating ? null : rating
    }));
  };

  const selectSuggestedPrompt = (prompt: string) => {
    setInputText(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="flex-grow flex flex-col h-[calc(100vh-64px)] overflow-hidden relative">
      
      {/* Scrollable messages container */}
      <section className="flex-grow overflow-y-auto pb-44 pt-6">
        <div className="max-w-[800px] mx-auto px-4 space-y-6">
          
          {/* Welcome State when Session is Empty */}
          {session.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center animate-fade-in py-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5 border border-primary/20 animate-bounce">
                <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  smart_toy
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
                I am DeepThink AI
              </h2>
              <p className="text-sm text-on-surface-variant mt-2 font-sans max-w-sm">
                How can I assist your coding or general research today?
              </p>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 w-full max-w-lg">
                {[
                  "Explain NumPy forward pass implementation",
                  "Create a fully customized CSS animation",
                  "Explain backpropagation from scratch",
                  "Write a responsive full-stack react hook"
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => selectSuggestedPrompt(prompt)}
                    className="cursor-pointer text-left p-3 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/20 hover:border-primary/40 text-xs font-semibold text-on-surface-variant hover:text-on-surface transition-all font-sans"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Listing */}
          {session.messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-primary flex-shrink-0 flex items-center justify-center text-on-primary mt-1 shadow-md">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                      bolt
                    </span>
                  </div>
                )}

                <div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
                  <div
                    className={`rounded-2xl p-4 md:p-5 relative overflow-hidden ${
                      isUser
                        ? "bg-secondary-container text-on-secondary-container rounded-tr-none border border-outline-variant/30"
                        : "glass-panel rounded-tl-none relative before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-primary/30"
                    }`}
                  >
                    {/* Render Formatted Content (Text & styled code snippets) */}
                    <div>{renderMessageContent(message.content)}</div>

                    {/* Sources grounding checklist display */}
                    {!isUser && message.sources && message.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-outline-variant/10 space-y-1.5">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest font-sans flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">travel_explore</span>
                          Verified References
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((src, sIdx) => (
                            <a
                              key={sIdx}
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] font-semibold bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/30 text-on-surface px-2.5 py-1 rounded-full transition-all inline-flex items-center gap-1 font-sans"
                            >
                              <span className="material-symbols-outlined text-[10px]">language</span>
                              {src.title.length > 20 ? src.title.substring(0, 20) + "..." : src.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feedback rating actions */}
                  <div className="flex items-center gap-3 px-1 text-[10px] text-on-surface-variant font-mono">
                    <span>{message.timestamp}</span>
                    {!isUser && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEval(message.id, "up")}
                          className={`cursor-pointer material-symbols-outlined hover:text-primary transition-colors text-sm focus:outline-none ${
                            evals[message.id] === "up" ? "text-primary fill-current font-bold" : ""
                          }`}
                        >
                          thumb_up
                        </button>
                        <button
                          onClick={() => handleEval(message.id, "down")}
                          className={`cursor-pointer material-symbols-outlined hover:text-primary transition-colors text-sm focus:outline-none ${
                            evals[message.id] === "down" ? "text-primary fill-current font-bold" : ""
                          }`}
                        >
                          thumb_down
                        </button>
                        <button
                          onClick={() => {
                            if (!isLoading) {
                              // Filter out assistant prompt & trigger resend
                              const lastUserMsg = session.messages.filter(m => m.role === "user").pop();
                              if (lastUserMsg) {
                                handleSend(lastUserMsg.content);
                              }
                            }
                          }}
                          className="cursor-pointer material-symbols-outlined hover:text-primary transition-colors text-sm focus:outline-none"
                        >
                          refresh
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex-shrink-0 flex items-center justify-center text-primary mt-1 shimmer-active">
                <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
              </div>
              <div className="glass-panel rounded-2xl rounded-tl-none p-4 w-[60%] flex flex-col gap-2 relative border-l-2 border-primary/20">
                <div className="h-2 bg-on-surface-variant/20 rounded w-5/6"></div>
                <div className="h-2 bg-on-surface-variant/20 rounded w-full"></div>
                <div className="h-2 bg-on-surface-variant/20 rounded w-2/3"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </section>

      {/* Floating Chat Input Section */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-background via-background/90 to-transparent">
        <div className="max-w-[800px] mx-auto relative">
          
          {/* Quick Info/Tools Panel */}
          <div className="glass-panel flex gap-2 items-center rounded-3xl p-1.5 shadow-xl">
            <button
              onClick={() => setInputText("Explain standard sigmoid calculation")}
              className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-highest transition-colors focus:outline-none"
              title="Add Context Shortcut"
            >
              <span className="material-symbols-outlined">add</span>
            </button>

            <textarea
              ref={inputRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`Message DeepThink (${settings.engine === "pro" ? "Pro-Titan active" : "Standard engine"})...`}
              className="flex-grow bg-transparent border-0 ring-0 focus:ring-0 focus:outline-none text-on-surface font-sans text-sm py-2 resize-none leading-relaxed px-1"
            />

            <div className="flex items-center gap-1.5 pr-1">
              <button
                onClick={handleMicToggle}
                className={`cursor-pointer w-10 h-10 rounded-full flex items-center justify-center transition-all focus:outline-none ${
                  micActive
                    ? "bg-primary text-on-primary animate-pulse"
                    : "text-on-surface-variant hover:bg-surface-container-highest"
                }`}
                title={micActive ? "Speech recognition listening..." : "Use voice input"}
              >
                <span className="material-symbols-outlined text-lg">
                  {micActive ? "hearing" : "mic"}
                </span>
              </button>

              <button
                onClick={() => handleSend()}
                disabled={isLoading || !inputText.trim()}
                className={`cursor-pointer w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md focus:outline-none ${
                  isLoading || !inputText.trim()
                    ? "bg-surface-container-highest text-on-surface-variant opacity-50 cursor-not-allowed"
                    : "bg-primary text-on-primary hover:opacity-95 hover:scale-105 active:scale-95 shadow-primary/20"
                }`}
              >
                <span className="material-symbols-outlined font-bold text-md">
                  arrow_upward
                </span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-center text-on-surface-variant/60 mt-2 font-sans font-medium">
            DeepThink AI can make errors. Verify system details. Powered securely by Gemini server-proxy.
          </p>
        </div>
      </div>

    </div>
  );
}
