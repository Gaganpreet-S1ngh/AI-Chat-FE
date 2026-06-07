import { useState, useEffect, ChangeEvent } from "react";
import { SettingsState, UserFile } from "../types";

interface SettingsViewProps {
  settings: SettingsState;
  onSaveSettings: (settings: SettingsState) => void;
  onThemeChange: (theme: "light" | "dark" | "system") => void;
}

export default function SettingsView({
  settings,
  onSaveSettings,
  onThemeChange
}: SettingsViewProps) {
  const [theme, setTheme] = useState(settings.theme);
  const [language, setLanguage] = useState(settings.language);
  const [engine, setEngine] = useState(settings.engine);
  const [streaming, setStreaming] = useState(settings.streaming);
  const [enableSearch, setEnableSearch] = useState(settings.enableSearchGrounding);
  const [systemInstruction, setSystemInstruction] = useState(settings.systemInstruction);

  // In-memory files fetched from server or simulated in state
  const [files, setFiles] = useState<UserFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch initial files
  useEffect(() => {
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => setFiles(data))
      .catch((err) => {
        // Fallback simulated initial files if API is not completed
        setFiles([
          { id: "1", name: "Project_Brief_Q4.pdf", size: "1.4 MB", uploadedAt: "Uploaded 2 days ago" },
          { id: "2", name: "Design_Mockup_v2.png", size: "8.2 MB", uploadedAt: "Uploaded 5 days ago" }
        ]);
      });
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    const updated: SettingsState = {
      theme,
      language,
      engine,
      streaming,
      enableSearchGrounding: enableSearch,
      systemInstruction
    };

    // Save via server or parent states
    setTimeout(() => {
      onSaveSettings(updated);
      onThemeChange(theme);
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1200);
  };

  const handleReset = () => {
    setTheme("dark");
    setLanguage("en");
    setEngine("standard");
    setStreaming(true);
    setEnableSearch(true);
    setSystemInstruction("You are DeepThink AI, a sophisticated intelligence assistant with advanced reasoning capabilities. Keep replies crisp and clear.");
    onThemeChange("dark");
  };

  const handleDeleteFile = (id: string) => {
    fetch(`/api/files/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
      })
      .catch(() => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
      });
  };

  // Drag & drop or click file uploads
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      const fileSizeStr = (file.size / (1024 * 1024)).toFixed(1) + " MB";
      
      fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, size: fileSizeStr })
      })
        .then((res) => res.json())
        .then((data) => {
          setFiles((prev) => [data, ...prev]);
          setIsUploading(false);
          setUploadProgress(0);
        })
        .catch(() => {
          const fakeFile: UserFile = {
            id: Date.now().toString(),
            name: file.name,
            size: fileSizeStr,
            uploadedAt: "Uploaded just now"
          };
          setFiles((prev) => [fakeFile, ...prev]);
          setIsUploading(false);
          setUploadProgress(0);
        });
    }, 1200);
  };

  // Compute total size
  const totalSizeUsed = files.reduce((acc, f) => {
    const parsed = parseFloat(f.size);
    return acc + (isNaN(parsed) ? 0 : parsed);
  }, 0).toFixed(1);

  return (
    <div className="max-w-[800px] mx-auto space-y-8 pb-32 pt-4">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary-fixed leading-tight tracking-tight">General Settings</h1>
        <p className="text-sm text-on-surface-variant mt-2 font-sans">
          Customize your DeepThink experience and manage account preferences.
        </p>
      </header>

      {/* Section: Personalization */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="material-symbols-outlined text-primary text-[22px]">palette</span>
          <h2 className="text-lg font-bold text-on-surface">Interface & Appearance</h2>
        </div>
        <div className="glass-card rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Theme Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant font-sans">System Appearance</label>
            <div className="flex bg-surface-container-high rounded-xl p-1 border border-outline-variant/20">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg transition-all focus:outline-none cursor-pointer ${
                  theme === "light"
                    ? "bg-primary-container text-on-primary-container shadow-md"
                    : "text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">light_mode</span>
                <span className="text-[10px] font-bold">LIGHT</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg transition-all focus:outline-none cursor-pointer ${
                  theme === "dark"
                    ? "bg-primary-container text-on-primary-container shadow-md"
                    : "text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">dark_mode</span>
                <span className="text-[10px] font-bold">DARK</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme("system")}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-lg transition-all focus:outline-none cursor-pointer ${
                  theme === "system"
                    ? "bg-primary-container text-on-primary-container shadow-md"
                    : "text-on-surface-variant hover:bg-surface-container-highest"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">desktop_windows</span>
                <span className="text-[10px] font-bold">SYSTEM</span>
              </button>
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-on-surface-variant font-sans" htmlFor="lang">
              Global Language
            </label>
            <select
              id="lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full glass-input rounded-xl px-4 py-3 text-sm text-on-surface outline-none appearance-none font-sans"
            >
              <option value="en">English (United States)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>
        </div>
      </section>

      {/* Section: AI Preferences */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="material-symbols-outlined text-primary text-[22px]">psychology</span>
          <h2 className="text-lg font-bold text-on-surface">Intelligence Engine</h2>
        </div>
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Model Preference</h3>
              <p className="text-on-surface-variant text-xs mt-0.5 font-sans">Choose the default engine for new sessions.</p>
            </div>
            <div className="flex bg-surface-container-high rounded-full p-1 border border-outline-variant/30 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setEngine("standard")}
                className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-bold transition-all focus:outline-none ${
                  engine === "standard"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setEngine("pro")}
                className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-bold transition-all focus:outline-none ${
                  engine === "pro"
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Pro-Titan 4.0
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Streaming Response</h3>
              <p className="text-on-surface-variant text-xs mt-0.5 font-sans">Display AI responses instantly as they generate.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={streaming}
                onChange={(e) => setStreaming(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Search & Web Grounding</h3>
              <p className="text-on-surface-variant text-xs mt-0.5 font-sans">Enable external Google Search queries for real-time validation.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableSearch}
                onChange={(e) => setEnableSearch(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex flex-col gap-2 pt-4 border-t border-outline-variant/10">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Base System Instruction</h3>
              <p className="text-on-surface-variant text-xs mt-0.5 font-sans mb-2">Set custom instructions for model persona.</p>
            </div>
            <textarea
              value={systemInstruction}
              onChange={(e) => setSystemInstruction(e.target.value)}
              rows={3}
              placeholder="System prompt instructions..."
              className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-sans"
            />
          </div>
        </div>
      </section>

      {/* Section: Storage & History */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="material-symbols-outlined text-primary text-[22px]">database</span>
          <h2 className="text-lg font-bold text-on-surface">Data Control & Storage</h2>
        </div>
        <div className="glass-card rounded-2xl p-6 space-y-6">
          <div>
            <div className="flex justify-between items-end mb-2">
              <div>
                <h3 className="text-sm font-bold text-on-surface">Neural Workspace Cloud Storage</h3>
                <p className="text-on-surface-variant text-xs mt-0.5 font-sans">
                  {totalSizeUsed} MB of 1024 MB simulating usage limit
                </p>
              </div>
              <label className="cursor-pointer text-xs font-semibold text-primary hover:underline font-sans">
                Upload File
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(208,188,255,0.4)]"
                style={{ width: `${Math.min(100, (parseFloat(totalSizeUsed) / 1024) * 100)}%` }}
              ></div>
            </div>
            {isUploading && (
              <div className="mt-2.5 flex items-center justify-between text-xs text-on-surface-variant font-mono">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
                  Uploading file...
                </span>
                <span>{uploadProgress}%</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider font-sans">
              Recent File Uploads
            </h4>
            <div className="space-y-2">
              {files.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-outline-variant/30 rounded-xl">
                  <p className="text-xs text-on-surface-variant font-sans">No files loaded. Try clicking Upload File above!</p>
                </div>
              ) : (
                files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/10 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-secondary-container/30 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-[20px]">
                          {file.name.endsWith(".png") || file.name.endsWith(".jpg") ? "image" : "description"}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-on-surface">{file.name}</p>
                        <p className="text-[10px] text-on-surface-variant font-sans">
                          {file.uploadedAt} • {file.size}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="cursor-pointer opacity-80 md:opacity-0 group-hover:opacity-100 material-symbols-outlined text-error p-1.5 hover:bg-error-container/20 rounded transition-all focus:outline-none"
                    >
                      delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-outline-variant/20">
        <button
          onClick={handleReset}
          className="cursor-pointer px-4 py-2.5 rounded-lg text-sm text-on-surface-variant hover:text-on-surface transition-colors font-semibold"
        >
          Reset Defaults
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="cursor-pointer px-6 py-2.5 bg-primary text-on-primary rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
        >
          {isSaving ? (
            <>
              <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
              <span>Saving...</span>
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* Success Toast */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 transition-all duration-300 z-50 bg-primary text-on-primary px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 ${
          showToast ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        }`}
      >
        <span className="material-symbols-outlined text-[20px] fill-current">check_circle</span>
        <span className="font-bold text-xs tracking-wide">Preferences saved successfully</span>
      </div>
    </div>
  );
}
