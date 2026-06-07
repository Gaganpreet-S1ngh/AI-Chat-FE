import { ChatSession, User } from "../types";

interface SidebarProps {
  currentView: "chat" | "settings" | "help";
  onViewChange: (view: "chat" | "settings" | "help") => void;
  user: User;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onSignOut: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({
  currentView,
  onViewChange,
  user,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onSignOut,
  isOpen,
  onClose
}: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-30 md:hidden cursor-pointer"
          onClick={onClose}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-[280px] bg-surface-container-low border-r border-outline-variant/30 backdrop-blur-md flex flex-col p-4 z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header Brand (Only shown if MD+ because on mobile we have the top app bar) */}
        <div className="hidden md:block mb-6 pt-2">
          <h1 className="text-xl font-bold text-primary mb-0.5 tracking-tight">Intelligence</h1>
          <p className="text-xs text-on-surface-variant font-mono">
            {user.fullName === "Alex Rivera" ? "Pro Plan" : "Free Explorer"}
          </p>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => {
            onNewChat();
            onViewChange("chat");
            onClose();
          }}
          className="cursor-pointer w-full flex items-center justify-center gap-2 bg-secondary-container hover:bg-surface-container-highest text-on-secondary-container rounded-lg px-4 py-3 border-l-4 border-primary transition-all active:scale-[0.98] mb-6 font-semibold"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="text-sm">New Chat</span>
        </button>

        {/* Sidebar Middle Navigation: Recent History & General Menu */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto pr-1">
          {sessions.length > 0 && (
            <div>
              <p className="px-3 pb-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">
                Recent History
              </p>
              <div className="flex flex-col gap-0.5 max-h-[220px] overflow-y-auto">
                {sessions.map((session) => {
                  const isActive = activeSessionId === session.id && currentView === "chat";
                  return (
                    <button
                      key={session.id}
                      onClick={() => {
                        onSelectSession(session.id);
                        onViewChange("chat");
                        onClose();
                      }}
                      className={`cursor-pointer w-full flex items-center gap-3 text-left rounded-lg px-3 py-2.5 transition-all text-sm font-sans truncate ${
                        isActive
                          ? "bg-primary-container/20 text-primary border-l-2 border-primary"
                          : "text-on-surface-variant hover:bg-surface-container-highest"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] opacity-70">
                        history
                      </span>
                      <span className="truncate flex-1 font-medium">{session.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-4 border-t border-outline-variant/20 pt-4 flex flex-col gap-0.5">
            <p className="px-3 pb-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest opacity-60">
              System Settings
            </p>

            <button
              onClick={() => {
                onViewChange("chat");
                onClose();
              }}
              className={`cursor-pointer w-full flex items-center gap-3 text-left rounded-lg px-3 py-2.5 transition-all text-sm font-sans ${
                currentView === "chat"
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              <span className="font-medium">Intelligence Engine</span>
            </button>

            <button
              onClick={() => {
                onViewChange("settings");
                onClose();
              }}
              className={`cursor-pointer w-full flex items-center gap-3 text-left rounded-lg px-3 py-2.5 transition-all text-sm font-sans ${
                currentView === "settings"
                  ? "bg-secondary-container text-on-secondary-container border-l-4 border-primary"
                  : "text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              <span className="font-medium">General Settings</span>
            </button>
          </div>
        </nav>

        {/* Footer Navigation menu */}
        <div className="mt-auto pt-4 border-t border-outline-variant/20 flex flex-col gap-2">
          {/* Active User Card profile */}
          <div className="flex items-center gap-3 p-2 bg-surface-container-highest/40 rounded-xl border border-outline-variant/10">
            <img
              alt="User profile avatar"
              className="w-10 h-10 rounded-full border border-primary/20 object-cover"
              src={user.avatarUrl}
            />
            <div className="flex-grow overflow-hidden">
              <p className="text-xs font-bold text-on-surface truncate leading-tight">
                {user.fullName}
              </p>
              <p className="text-[10px] font-mono text-primary font-bold">
                {user.fullName === "Alex Rivera" ? "PRO ACCOUNT" : "FREE EXPLORER"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => {
                onViewChange("help");
                onClose();
              }}
              className={`cursor-pointer flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-colors text-left font-sans ${
                currentView === "help"
                  ? "bg-secondary-container text-on-secondary-container border-l-4 border-primary"
                  : "text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">help</span>
              <span className="font-medium">Help & Feedback</span>
            </button>
            <button
              onClick={onSignOut}
              className="cursor-pointer flex items-center gap-3 text-error hover:bg-error-container/20 rounded-lg px-3 py-2 text-xs transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
