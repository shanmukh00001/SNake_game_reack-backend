import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../services/api.js";
import { Button } from "../components/ui/Button.jsx";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/Card.jsx";
import { User, Play } from "lucide-react";

/**
 * Clean, restrained Login & Guest Start view.
 */
export default function LoginPage() {
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const { login, loginAsGuest } = useAuth();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await API.post("auth/google", {
        token: credentialResponse.credential,
      });

      setMessage({
        text: "Authenticated successfully.",
        type: "success",
      });

      setTimeout(() => {
        login(data);
      }, 400);
    } catch (err) {
      setMessage({
        text:
          err.response?.data?.message || "Google Authentication failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setMessage({
      text: "Google Sign-In failed. Please try again.",
      type: "error",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto border-slate-700/80 bg-slate-900/90 shadow-2xl p-4 sm:p-6 rounded-xl">
      <CardHeader className="text-center space-y-2 pb-4 border-b border-slate-700/80">
        <div className="flex justify-center mb-1">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400 shadow-inner">
            <User className="w-5 h-5" />
          </div>
        </div>
        <span className="font-mono text-[10px] text-emerald-400 font-semibold uppercase tracking-widest block">
          OPERATOR ACCESS // TACTILE EDITION
        </span>
        <CardTitle className="text-xl font-bold font-display text-white">
          Snake Arcade Authorization
        </CardTitle>
        <CardDescription className="text-slate-300 text-xs leading-relaxed">
          Authenticate to sync global leaderboards or commence as an unregistered guest.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-5">
        {/* Google OAuth container */}
        <div className="flex flex-col items-center justify-center py-2">
          {loading ? (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 py-3">
              <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              <span>AUTHENTICATING TELEMETRY...</span>
            </div>
          ) : (
            <div className="p-1 rounded-lg bg-slate-800 border border-slate-700 shadow-md">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_blue"
                shape="rectangular"
              />
            </div>
          )}
        </div>

        {message.text && (
          <p
            className={`text-center text-xs font-mono py-2.5 px-3 rounded-lg border ${
              message.type === "error"
                ? "bg-rose-500/15 border-rose-500/40 text-rose-300"
                : "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
            }`}
          >
            {message.text}
          </p>
        )}

        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-slate-700 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] uppercase font-mono font-bold tracking-widest text-slate-400 absolute">
            OR
          </span>
        </div>

        <Button
          variant="secondary"
          size="lg"
          className="w-full gap-2 font-mono uppercase bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 hover:border-slate-500 shadow-md"
          onClick={loginAsGuest}
        >
          <Play className="w-4 h-4 text-emerald-400 fill-current" /> PLAY AS GUEST OPERATOR
        </Button>
      </CardContent>
    </Card>
  );
}
