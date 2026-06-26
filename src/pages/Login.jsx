import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Phone, MessageCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
// import axios from "axios";
// import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const { loginWithEmail, sendPhoneOtp, verifyPhoneOtp, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState("email"); // "email" | "phone"
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPhoneOtp(phone);
      setOtpSent(true);
      toast.success("OTP sent to your phone");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyPhoneOtp(phone, otp);
      toast.success("Welcome!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // const handleGoogleLogin = () => {

  //   toast.error("Add your Google Client ID in .env to enable this");
  //   // In production: trigger Google Identity Services popup, get idToken, then:
  //   // await loginWithGoogle(idToken);
  // };

  // const googleLogin = useGoogleLogin({
  //   flow: "implicit",
  //   onSuccess: async (tokenResponse) => {
  //     // console.log(tokenResponse);
  //     console.log("SUCCESS",tokenResponse);
  //   },
  //   onError: (error) => {
  //     toast.error("Google login failed");
  //       console.log("ERROR", error);
  //   },
  // });

  // const handleGoogleLogin = () => {
  //   googleLogin();
  // };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent-50 via-white to-surface-subtle dark:from-surface-dark dark:via-surface-dark dark:to-surface-darkSubtle px-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle compact />
      </div>

      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-500 flex items-center justify-center shadow-lg mb-3">
            <MessageCircle className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to continue chatting</p>
        </div>

        <div className="bg-white dark:bg-surface-darkPanel rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
          <div className="flex gap-2 mb-6 bg-gray-100 dark:bg-surface-dark p-1 rounded-xl">
            <button
              onClick={() => setMode("email")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === "email"
                ? "bg-white dark:bg-surface-darkPanel text-accent-600 shadow"
                : "text-gray-500 dark:text-gray-400"
                }`}
            >
              Email
            </button>
            <button
              onClick={() => setMode("phone")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === "phone"
                ? "bg-white dark:bg-surface-darkPanel text-accent-600 shadow"
                : "text-gray-500 dark:text-gray-400"
                }`}
            >
              Phone
            </button>
          </div>

          {mode === "email" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-medium transition disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          )}

          {mode === "phone" && !otpSent && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+923001234567"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Include country code, e.g. +92 for Pakistan</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-medium transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          )}

          {mode === "phone" && otpSent && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Enter OTP sent to {phone}
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center text-xl tracking-widest py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-surface-dark text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white font-medium transition disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
              </button>
              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-accent-600"
              >
                Change phone number
              </button>
            </form>
          )}

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-surface-dark text-gray-700 dark:text-gray-200 font-medium transition"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.85 2.09-1.81 2.73v2.27h2.92c1.71-1.57 2.69-3.88 2.69-6.64z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.92-2.27c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34C2.44 15.98 5.48 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.97 10.71c-.18-.54-.28-1.11-.28-1.71s.1-1.17.28-1.71V4.95H.96A8.996 8.996 0 000 9c0 1.45.35 2.83.96 4.05l3.01-2.34z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.95l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z"
              />
            </svg>
            Continue with Google
          </button> */}
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                setLoading(true);

                await loginWithGoogle(
                  credentialResponse.credential
                );

                toast.success("Welcome!");
                navigate("/");
              } catch (error) {
                toast.error(
                  error.response?.data?.message ||
                  "Google login failed"
                );
              } finally {
                setLoading(false);
              }
            }}
            onError={() => {
              toast.error("Google login failed");
            }}
          />
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-accent-600 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
