import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "../api/base44Client";
import AuthLayout from "../components/AuthLayout";
import GoogleIcon from "../components/GoogleIcon";
import { getReturnTo } from "../lib/authReturnTo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await base44.auth.loginViaEmailPassword(email, password);
    } catch (e) {
      setErr((e && (e.message || e.error)) || "Could not sign in.");
      setBusy(false);
    }
  };

  const google = async () => {
    setBusy(true);
    setErr("");
    try {
      await base44.auth.loginWithProvider("google", getReturnTo());
    } catch (e) {
      setErr((e && (e.message || e.error)) || "Google sign-in failed.");
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back">
      <form onSubmit={submit} className="space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm focus:outline-none focus:border-amber-400/50"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm focus:outline-none focus:border-amber-400/50"
        />
        {err && <p className="text-red-400 text-xs">{err}</p>}
        <button
          disabled={busy}
          className="w-full px-4 py-2 rounded-lg bg-amber-400 text-black font-bold text-sm disabled:opacity-40"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <div className="my-3 text-center text-xs text-white/30">or</div>
      <button
        onClick={google}
        disabled={busy}
        className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm flex items-center justify-center gap-2 disabled:opacity-40"
      >
        <GoogleIcon className="w-4 h-4" /> Continue with Google
      </button>
      <div className="flex justify-between text-xs text-white/50 mt-4">
        <Link to="/register" className="hover:text-white">Create account</Link>
        <Link to="/forgot-password" className="hover:text-white">Forgot password?</Link>
      </div>
    </AuthLayout>
  );
}