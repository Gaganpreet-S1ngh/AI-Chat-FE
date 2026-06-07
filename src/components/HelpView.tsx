import { useState, FormEvent } from "react";

interface HelpViewProps {
  userEmail: string;
}

interface FeedbackLog {
  id: string;
  type: string;
  subject: string;
  message: string;
  timestamp: string;
}

export default function HelpView({ userEmail }: HelpViewProps) {
  // Feedback Form States
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  
  // Feedbacks state log (simulating active tracking list)
  const [recentFeedbacks, setRecentFeedbacks] = useState<FeedbackLog[]>([
    {
      id: "fb-1",
      type: "bug",
      subject: "Vite HMR Websocket Warnings",
      message: "WS connects but logs normal sandbox socket notices. Working great otherwise!",
      timestamp: "Today, 10:45 AM"
    }
  ]);

  // Accordion FAQ states
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is Aether Intelligence (DeepThink AI)?",
      a: "Aether Intelligence is an advanced reasoning environment powered server-side by premium Google Gemini models (including standard and Pro-Titan variants), utilizing Google Search grounding to retrieve real-time data securely without exposing keys to client-side browsers."
    },
    {
      q: "How does Search & Web Grounding work?",
      a: "When active, DeepThink uses internal Google Search tools to validate statements, fetch public data pages or live references, and supply inline citations linked directly under generated replies."
    },
    {
      q: "Where is my data stored?",
      a: "All conversation states, recent session titles, and uploaded documents are stored in-memory using highly responsive full-stack server-side proxy layers and lightweight local persistence engines."
    },
    {
      q: "How can I customize active system rules?",
      a: "Navigate to general preferences and edit the 'Base System Instruction'. You can dictate custom persona rules, code syntax standards, formatting preferences, or strict constraints."
    },
    {
      q: "Are my workspace file uploads securely sandboxed?",
      a: "Yes. Integrated PDF documents or layout graphics are proxied behind specialized middleware, keeping sensitive assets off public folders and available strictly within active node processes."
    }
  ];

  const handleFeedbackSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newFeedback: FeedbackLog = {
        id: `fb-${Date.now()}`,
        type: feedbackType,
        subject,
        message,
        timestamp: "Just now"
      };

      setRecentFeedbacks((prev) => [newFeedback, ...prev]);
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      setSubject("");
      setMessage("");

      setTimeout(() => setSubmissionSuccess(false), 3500);
    }, 1200);
  };

  return (
    <div className="max-w-[800px] mx-auto space-y-8 pb-32 pt-4 animate-fade-in">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-primary-fixed leading-tight tracking-tight">Help & Feedback</h1>
        <p className="text-sm text-on-surface-variant mt-2 font-sans">
          Access our comprehensive guides, verify system status, or share recommendations directly with our engineering panel.
        </p>
      </header>

      {/* System Status / Diagnostics Monitor (Real-time Simulation) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="material-symbols-outlined text-primary text-[22px]">dns</span>
          <h2 className="text-lg font-bold text-on-surface">Workspace Status</h2>
        </div>
        <div className="glass-card rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-surface-container-low/50 rounded-xl border border-outline-variant/10 text-center sm:text-left">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-sans">API Endpoint Status</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-sm font-semibold text-on-surface font-mono">OPERATIONAL</span>
            </div>
          </div>
          <div className="p-3 bg-surface-container-low/50 rounded-xl border border-outline-variant/10 text-center sm:text-left">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-sans">Gemini Proxy Session</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-sm font-semibold text-on-surface font-mono">CONNECTED</span>
            </div>
          </div>
          <div className="p-3 bg-surface-container-low/50 rounded-xl border border-outline-variant/10 text-center sm:text-left">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest font-sans">Average Latency</p>
            <p className="text-lg font-black text-primary mt-1 font-mono">428ms</p>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="material-symbols-outlined text-primary text-[22px]">quiz</span>
          <h2 className="text-lg font-bold text-on-surface">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-2.5">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="glass-card rounded-xl overflow-hidden border border-outline-variant/10 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="cursor-pointer w-full flex items-center justify-between p-4 text-left focus:outline-none hover:bg-surface-container-low/30 transition-colors"
                >
                  <span className="text-sm font-bold text-on-surface font-sans pr-4">{faq.q}</span>
                  <span className="material-symbols-outlined text-primary text-md transition-transform duration-300 transform">
                    {isOpen ? "expand_less" : "expand_more"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 border-t border-outline-variant/5">
                    <p className="text-xs text-on-surface-variant leading-relaxed font-sans">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Feedback Form & Recent Submissions */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="material-symbols-outlined text-primary text-[22px]">rate_review</span>
          <h2 className="text-lg font-bold text-on-surface">Send Feedback & Report Issues</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Submit Block */}
          <div className="md:col-span-2 glass-card rounded-2xl p-6 space-y-4 relative overflow-hidden">
            <h3 className="text-sm font-bold text-on-surface">Share your thoughts</h3>
            <p className="text-xs text-on-surface-variant font-sans">
              Help us refine Aether. Your input goes straight to our internal system optimization logs.
            </p>

            <form onSubmit={handleFeedbackSubmit} className="space-y-3.5 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-sans ml-0.5">Feedback Type</label>
                  <select
                    value={feedbackType}
                    onChange={(e) => setFeedbackType(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/25 rounded-lg py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                  >
                    <option value="suggestion">Feature Suggestion</option>
                    <option value="bug">Report a Bug</option>
                    <option value="question">General Inquiry</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-sans ml-0.5">Your Registered Email</label>
                  <input
                    type="text"
                    disabled
                    value={userEmail || "alex.rivera@company.com"}
                    className="w-full bg-surface-container border border-outline-variant/10 rounded-lg py-2 px-3 text-xs text-on-surface-variant/75 font-mono cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-sans ml-0.5">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summarize your request..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-surface-container-low border border-outline-variant/25 rounded-lg py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider font-sans ml-0.5">Message Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="In details, list what works, what doesn't, or what you would change..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-surface-container-low border border-outline-variant/25 rounded-lg py-2 px-3 text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-sans resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !subject.trim() || !message.trim()}
                className={`cursor-pointer w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md focus:outline-none ${
                  isSubmitting
                    ? "bg-surface-container-highest text-on-surface-variant opacity-60 cursor-not-allowed"
                    : "bg-primary text-on-primary hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] shadow-primary/10"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    <span>Transmitting feedback log...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    <span>Transmit Feedback</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Submission Feedback list */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-on-surface">Transmission Logs</h4>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {recentFeedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="p-3.5 bg-surface-container-low border border-outline-variant/10 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                      fb.type === "bug"
                        ? "bg-error/20 text-error"
                        : fb.type === "suggestion"
                        ? "bg-primary-container/20 text-primary"
                        : "bg-secondary-container/50 text-on-secondary-container"
                    }`}>
                      {fb.type}
                    </span>
                    <span className="text-[10px] text-on-surface-variant font-mono">{fb.timestamp}</span>
                  </div>
                  <h5 className="text-xs font-bold text-on-surface truncate leading-tight">{fb.subject}</h5>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed font-sans line-clamp-3">
                    {fb.message}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Helpful Contact Banner */}
      <footer className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px] fill-current">contact_support</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-on-surface leading-tight">Complex or urgent configuration block?</h4>
            <p className="text-xs text-on-surface-variant font-sans mt-0.5">Our dedicated support panel is available 24/7 for Enterprise configurations.</p>
          </div>
        </div>
        <a
          href="mailto:gsshonty19@gmail.com"
          className="bg-secondary-container hover:bg-surface-container-highest border border-outline-variant/30 text-on-secondary-container hover:text-on-surface font-semibold text-xs px-5 py-2.5 rounded-xl transition-all self-stretch sm:self-auto text-center"
        >
          Contact Engineering
        </a>
      </footer>

      {/* Success alert message toast */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 transition-all duration-300 z-50 bg-primary text-on-primary px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 ${
          submissionSuccess ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
        }`}
      >
        <span className="material-symbols-outlined text-[20px] fill-current animate-bounce">rocket_launch</span>
        <span className="font-bold text-xs tracking-wide">Feedback log transmitted successfully!</span>
      </div>
    </div>
  );
}
