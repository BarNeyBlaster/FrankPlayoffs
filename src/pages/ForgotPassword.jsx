import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "../api/base44Client";
import AuthLayout from "../components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await base44.auth.resetPasswordRequest(email);
    } catch {
      /* ignore — always show generic success */
    }
    setDone(true);
    setBusy(false);
  };

  return (
    <AuthLayout title="Reset password" subtitle="We'll send you a reset link">
      {done ? (
        <div className="text-center space-y-3">
          <p className="text-sm text-white/60">
            If an account exists for {email}, a reset link is on its way.
          </p>
          <Link to="/login" className="text-amber-400 text-sm hover:underline">Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm focus:outline-none focus:border-amber-400/50"
          />
          <button
            disabled={busy}
            className="w-full px-4 py-2 rounded-lg bg-amber-400 text-black font-bold text-sm disabled:opacity-40"
          >
            {busy ? "Sending…" : "Send reset link"}
          </button>
          <p className="text-xs text-white/50 mt-4 text-center">
            <Link to="/login" className="hover:text-white">Back to sign in</Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}