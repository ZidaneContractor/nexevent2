"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent, type: "login" | "signup") => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (type === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage({
          type: "success",
          text: "Check your email for the confirmation link!",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ type: "success", text: "Logged in successfully!" });
        router.push("/organizer");
        router.refresh();
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center pt-24 pb-20">
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md px-6 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Feed
        </Link>

        <div className="bg-card/40 backdrop-blur-md border border-border rounded-3xl p-8 shadow-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-white">
            Welcome Back
          </h1>
          <p className="text-muted-foreground mb-8">
            Sign in or create an account to start creating events.
          </p>

          <form className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="you@campus.edu"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-white/90 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {message.text && (
              <div
                className={`p-4 rounded-xl text-sm font-medium ${message.type === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"}`}
              >
                {message.text}
              </div>
            )}

            <div className="flex gap-4 mt-2">
              <button
                type="button"
                onClick={(e) => handleAuth(e, "login")}
                disabled={loading}
                className="flex-1 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={(e) => handleAuth(e, "signup")}
                disabled={loading}
                className="flex-1 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all border border-white/10 disabled:opacity-50"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
