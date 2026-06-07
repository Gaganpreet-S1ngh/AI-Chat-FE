import { useState, FormEvent } from "react";
import { User } from "../types";

interface SignupViewProps {
  onLoginToggle: () => void;
  onSuccess: (user: User) => void;
}

export default function SignupView({ onLoginToggle, onSuccess }: SignupViewProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (!agree) {
      setError("You must agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);

    // Simulate creation
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess({
          fullName,
          email,
          provider: "email",
          avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`
        });
      }, 1000);
    }, 1500);
  };

  const handleSocialSignup = (provider: "google" | "github") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        fullName: provider === "google" ? "Alex Rivera" : "Github Contributor",
        email: provider === "google" ? "alex.rivera@company.com" : "github.user@github.com",
        provider,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider === "google" ? "Alex" : "Git"}`
      });
    }, 1000);
  };

  return (
    <div className="w-full max-w-[480px] p-4 z-10 animate-fade-in">
      {/* Header / Logo Area */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-on-surface tracking-tight mb-1">
          DeepThink AI
        </h1>
        <p className="text-sm text-on-surface-variant font-sans">
          Start your AI-powered journey today.
        </p>
      </div>

      {/* Signup Card */}
      <div className="glass-panel inner-glow rounded-2xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold tracking-tight text-primary">Create Account</h2>
          <p className="text-xs text-on-surface-variant font-sans">Join our intelligence ecosystem in seconds.</p>
        </div>

        {error && (
          <div className="bg-error/15 border border-error/30 text-error text-xs rounded-lg p-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Social Signups */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSocialSignup("google")}
            className="cursor-pointer flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-medium py-2.5 px-3 rounded-lg transition-colors border border-outline-variant/30 font-sans"
          >
            <img
              alt="Google Logo"
              className="w-5 h-5"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQJ2kNqXwuZqvhRQaJPUwgZNDZcRvP4F5N0-7A9M_a6OHqGRYuJasDK_SRpCtkzBA6EAG_X0_LBM0NCREVVhSQcxxmUAMlTj5De9oWmoWr0I1v97n721MTd6LX-JSKm9p2g1eBTaNDNQK5rhOIMYu1LDKutR_J4j1PydRfPVklfmLyC41_qcqkh5gSX__hAobEjNfIOswm41G2FCBL54T74RrccVmrZeLjNcU1WLk3S7wEmzhzzyV_Gii6nyO_ZPYsQTC5VVTAestp"
            />
            Google
          </button>
          <button
            onClick={() => handleSocialSignup("github")}
            className="cursor-pointer flex items-center justify-center gap-2 bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-sm font-medium py-2.5 px-3 rounded-lg transition-colors border border-outline-variant/30 font-sans"
          >
            <span className="material-symbols-outlined text-[20px]">brand_awareness</span>
            Github
          </button>
        </div>

        <div className="flex items-center gap-3 py-1">
          <div className="h-px bg-outline-variant/30 flex-grow"></div>
          <span className="text-[10px] tracking-wider font-bold text-outline uppercase font-sans">OR CONTINUE WITH EMAIL</span>
          <div className="h-px bg-outline-variant/30 flex-grow"></div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant ml-1 font-sans" htmlFor="fullname">Full Name</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60">person</span>
              <input
                id="fullname"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                disabled={isLoading || isSuccess}
                className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none py-2.5 pl-11 pr-4 rounded-lg text-sm text-on-surface placeholder:text-outline/50 transition-all font-sans"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant ml-1 font-sans" htmlFor="email">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60">mail</span>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                disabled={isLoading || isSuccess}
                className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none py-2.5 pl-11 pr-4 rounded-lg text-sm text-on-surface placeholder:text-outline/50 transition-all font-sans"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface-variant ml-1 font-sans" htmlFor="password">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60">lock</span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isLoading || isSuccess}
                className="w-full bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none py-2.5 pl-11 pr-12 rounded-lg text-sm text-on-surface placeholder:text-outline/50 transition-all font-sans"
              />
              <button
                type="button"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2.5 mt-1">
            <input
              id="terms"
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              disabled={isLoading || isSuccess}
              className="mt-1 rounded bg-surface-container-low border-outline-variant/30 text-primary focus:ring-primary w-4 h-4"
            />
            <label className="text-xs text-on-surface-variant font-sans cursor-pointer leading-tight" htmlFor="terms">
              I agree to the{" "}
              <a href="#" className="text-primary hover:underline font-medium">Terms of Service</a>{" "}and{" "}
              <a href="#" className="text-primary hover:underline font-medium">Privacy Policy</a>.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="cursor-pointer w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] mt-3 flex items-center justify-center gap-2 text-sm font-sans"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>Generating Node...</span>
              </>
            ) : isSuccess ? (
              <>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Account Created!</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-outline-variant/10">
          <p className="text-xs text-on-surface-variant font-sans">
            Already have an account?{" "}
            <button
              onClick={onLoginToggle}
              className="cursor-pointer text-primary font-bold hover:underline ml-1 focus:outline-none"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      {/* Footer Help Link */}
      <footer className="mt-8 text-center">
        <a href="#" className="inline-flex items-center gap-1.5 text-xs font-semibold text-outline hover:text-primary transition-colors font-sans">
          <span className="material-symbols-outlined text-[18px]">help</span>
          Need assistance? Contact support
        </a>
      </footer>
    </div>
  );
}
