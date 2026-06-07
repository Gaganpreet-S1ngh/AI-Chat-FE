import { useState, FormEvent } from "react";
import { User } from "../types";

interface LoginViewProps {
  onSignupToggle: () => void;
  onSuccess: (user: User) => void;
}

export default function LoginView({ onSignupToggle, onSuccess }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    // Simulate validation
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        // Create user
        const mockName = email.split("@")[0];
        const formattedName = mockName.charAt(0).toUpperCase() + mockName.slice(1);
        onSuccess({
          fullName: formattedName || "Alex Rivera",
          email: email,
          provider: "email",
          avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(formattedName)}`
        });
      }, 1000);
    }, 1500);
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess({
        fullName: "Alex Rivera",
        email: "alex.rivera@company.com",
        provider,
        avatarUrl: `https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg`
      });
    }, 1000);
  };

  return (
    <div className="w-full max-w-[440px] p-4 z-10 animate-fade-in">
      {/* Branding Header */}
      <div className="text-center mb-8 animate-float">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-surface-container mb-4 border border-outline-variant/30 shadow-md">
          <span className="material-symbols-outlined text-primary text-[32px] fill-current animate-pulse">
            auto_awesome
          </span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-on-surface">
          Aether <span className="ai-gradient-text">Intelligence</span>
        </h1>
        <p className="text-sm text-on-surface-variant font-sans mt-1">
          Sign in to your neural workspace
        </p>
      </div>

      {/* Login Card */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 border border-outline-variant/20 relative overflow-hidden">
        {/* Inner Glow Shimmer (CSS-only top border lights) */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>

        {error && (
          <div className="bg-error/15 border border-error/30 text-error text-xs rounded-lg p-3 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant block ml-1 font-sans" htmlFor="email">
              Email Address
            </label>
            <div className="relative flex items-center group">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant group-focus-within:text-primary transition-colors">
                alternate_email
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || isSuccess}
                placeholder="name@company.com"
                className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg py-3 pl-11 pr-4 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans text-sm"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-semibold text-on-surface-variant font-sans" htmlFor="password">
                Password
              </label>
              <a href="#" className="text-xs font-semibold text-primary hover:text-primary-fixed-dim transition-colors font-sans decoration-transparent hover:underline">
                Forgot Password?
              </a>
            </div>
            <div className="relative flex items-center group">
              <span className="material-symbols-outlined absolute left-3.5 text-on-surface-variant group-focus-within:text-primary transition-colors">
                lock
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || isSuccess}
                placeholder="••••••••"
                className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 rounded-lg py-3 pl-11 pr-12 text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-sans text-sm"
              />
              <button
                type="button"
                className="absolute right-3.5 text-on-surface-variant hover:text-on-surface focus:outline-none transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* CTA Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="cursor-pointer w-full bg-primary hover:bg-primary-container text-on-primary font-bold py-3.5 rounded-lg shadow-lg shadow-primary/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm font-sans"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>Initializing Sync...</span>
              </>
            ) : isSuccess ? (
              <>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Access Granted</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/20"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
              <span className="bg-surface-container px-3 text-on-surface-variant font-sans">
                OR CONTINUE WITH
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleSocialLogin("google")}
              className="cursor-pointer flex items-center justify-center gap-2 bg-surface-container-high/50 border border-outline-variant/20 py-2.5 rounded-lg hover:bg-surface-container-highest transition-colors font-sans font-medium text-xs text-on-surface"
            >
              <img
                alt="Google Logo"
                className="w-4 h-4"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQJ2kNqXwuZqvhRQaJPUwgZNDZcRvP4F5N0-7A9M_a6OHqGRYuJasDK_SRpCtkzBA6EAG_X0_LBM0NCREVVhSQcxxmUAMlTj5De9oWmoWr0I1v97n721MTd6LX-JSKm9p2g1eBTaNDNQK5rhOIMYu1LDKutR_J4j1PydRfPVklfmLyC41_qcqkh5gSX__hAobEjNfIOswm41G2FCBL54T74RrccVmrZeLjNcU1WLk3S7wEmzhzzyV_Gii6nyO_ZPYsQTC5VVTAestp"
              />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin("github")}
              className="cursor-pointer flex items-center justify-center gap-2 bg-surface-container-high/50 border border-outline-variant/20 py-2.5 rounded-lg hover:bg-surface-container-highest transition-colors font-sans font-medium text-xs text-on-surface"
            >
              <svg className="w-4 h-4 fill-on-surface animate-pulse" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.292c0-6.627-5.373-12-12-12z"></path>
              </svg>
              <span>GitHub</span>
            </button>
          </div>
        </form>
      </div>

      {/* Footer Link */}
      <p className="text-center mt-8 font-sans text-xs text-on-surface-variant">
        Don't have an account?{" "}
        <button
          onClick={onSignupToggle}
          className="cursor-pointer text-primary font-bold hover:underline ml-1 focus:outline-none"
        >
          Create an account
        </button>
      </p>
    </div>
  );
}
