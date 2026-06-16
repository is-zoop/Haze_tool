import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { GoogleIcon } from "./GoogleIcon";
import { motion, AnimatePresence } from "motion/react";

interface LoginFormProps {
  onLoginSuccess: (email: string) => void;
}

type AuthMode = "signin" | "signup" | "forgot";

export function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Feedback states
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setErrorMsg("");
    setSuccessMsg("");
    setEmail("");
    setPassword("");
    setFullName("");
  };

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setErrorMsg("");
    // Simulate minor delay
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess("google.creatives@haze.ai");
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    if (!validateEmail(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (authMode === "signin") {
      if (!password) {
        setErrorMsg("Please enter your password.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }

      // Successful simulated login
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(email);
      }, 1500);

    } else if (authMode === "signup") {
      if (!fullName) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (!password) {
        setErrorMsg("Please define a secure password.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMsg("Account created successfully! Let's log in.");
        setAuthMode("signin");
        setPassword("");
      }, 1500);

    } else if (authMode === "forgot") {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMsg(`We have successfully dispatched a verification code to ${email}. Check your inbox!`);
        setEmail("");
      }, 1500);
    }
  };

  // Staggered bounce text animation variants
  const wordContainerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: {
      opacity: 1,
      y: [20, -18, 0],
      transition: {
        times: [0, 0.45, 1],
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center h-full min-h-[480px]">
      <AnimatePresence mode="wait">
        {authMode === "signin" && (
          <motion.div
            key="signin"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col"
          >
            {/* Greetings with jumping stagger animation */}
            <div className="text-center md:text-left mb-6">
              <motion.h2 
                variants={wordContainerVariants}
                initial="hidden"
                animate="visible"
                className="text-3xl sm:text-4xl font-bold font-display text-foreground tracking-tight leading-none mb-2 flex justify-center md:justify-start overflow-hidden py-1 h-[44px] sm:h-[48px]"
              >
                {"Hi there!".split("").map((char, index) => (
                  <motion.span
                    key={index}
                    variants={letterVariants}
                    className="inline-block whitespace-pre text-foreground"
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h2>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                Welcome to Haze. AI Platform
              </p>
            </div>

            {/* Error & Success Feeds */}
            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold border border-destructive/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-500/10 text-emerald-700 text-xs font-semibold border border-emerald-500/20 flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-border bg-card hover:bg-accent py-3 text-xs font-semibold text-foreground shadow-xs transition-colors cursor-pointer select-none"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                ) : (
                  <GoogleIcon />
                )}
                <span>Log in with Google</span>
              </button>

              {/* Or divider */}
              <div className="flex items-center gap-3 py-1">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 rounded-xl border border-input focus-within:border-ring bg-card px-3.5 py-3 shadow-2xs focus-within:ring-1 focus-within:ring-ring transition-all">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground font-sans outline-hidden border-none"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 rounded-xl border border-input focus-within:border-ring bg-card px-3.5 py-3 shadow-2xs focus-within:ring-1 focus-within:ring-ring transition-all">
                  <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground font-sans outline-hidden border-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="p-0.5 hover:bg-accent rounded-md transition-colors text-muted-foreground hover:text-foreground focus:outline-hidden cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => handleModeChange("forgot")}
                  className="text-xs font-semibold text-primary hover:underline transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Log In Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground py-3.5 px-4 rounded-full text-xs font-bold tracking-wide shadow-md hover:shadow-lg disabled:opacity-75 transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                    <span>Synchronizing Secure Session...</span>
                  </>
                ) : (
                  <span>Log In</span>
                )}
              </button>
            </form>

            {/* Bottom Register Switch */}
            <div className="text-center mt-6">
              <p className="text-xs text-muted-foreground font-medium">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleModeChange("signup")}
                  className="text-primary font-semibold hover:underline transition-colors cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            </div>
          </motion.div>
        )}

        {authMode === "signup" && (
          <motion.div
            key="signup"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col"
          >
            {/* Title */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => handleModeChange("signin")}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-bold mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
              <h2 className="text-3xl font-bold font-display text-foreground tracking-tight leading-none mb-2">
                Create Account
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Join Haze AI and start generating art.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold border border-destructive/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 rounded-xl border border-input focus-within:border-ring bg-card px-3.5 py-3 shadow-2xs focus-within:ring-1 focus-within:ring-ring transition-all">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground font-sans outline-hidden border-none"
                  />
                </div>
              </div>

              {/* Email field */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 rounded-xl border border-input focus-within:border-ring bg-card px-3.5 py-3 shadow-2xs focus-within:ring-1 focus-within:ring-ring transition-all">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground font-sans outline-hidden border-none"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 rounded-xl border border-input focus-within:border-ring bg-card px-3.5 py-3 shadow-2xs focus-within:ring-1 focus-within:ring-ring transition-all">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    placeholder="Password (min 6 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground font-sans outline-hidden border-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground py-3.5 px-4 rounded-full text-xs font-bold tracking-wide shadow-md disabled:opacity-75 transition-colors cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                ) : (
                  <span>Sign Up & Continue</span>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {authMode === "forgot" && (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col"
          >
            {/* Title */}
            <div className="mb-6">
              <button
                type="button"
                onClick={() => handleModeChange("signin")}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-bold mb-4 transition-colors cursor-pointer"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </button>
              <h2 className="text-3xl font-bold font-display text-foreground tracking-tight leading-none mb-2">
                Recovery
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Enter your registered email to reset password.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold border border-destructive/20 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email field */}
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 rounded-xl border border-input focus-within:border-ring bg-card px-3.5 py-3 shadow-2xs focus-within:ring-1 focus-within:ring-ring transition-all">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground font-sans outline-hidden border-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/95 text-primary-foreground py-3.5 px-4 rounded-full text-xs font-bold tracking-wide shadow-md disabled:opacity-75 transition-colors cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                ) : (
                  <span>Send Recovery Code</span>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
