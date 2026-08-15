import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const token = new URLSearchParams(window.location.search).get("token");

  if (!token) {
    return (
      <AuthLayout title="Reset password">
        <p className="text-sm text-white/60 text-center">
          No reset token found.{" "}
          <Link to="/forgot-password" className="text-amber-400 hover:underline">Request a new link</Link>.
        </p>
      </AuthLayout>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setErr("Passwords don't match.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await base44.auth.resetPassword({ resetToken: token, newPassword: password });
      window.location.href = "/login";
    } catch (e) {
      setErr((e && (e.message || e.error)) || "Could not reset password.");
      setBusy(false);
    }
  };

  return (
    <AuthLayout title="New password" subtitle="Choose a new password">
      <form onSubmit={submit} className="space-y-3">
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm focus:outline-none focus:border-amber-400/50"
        />
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm focus:outline-none focus:border-amber-400/50"
        />
        {err && <p className="text-red-400 text-xs">{err}</p>}
        <button
          disabled={busy}
          className="w-full px-4 py-2 rounded-lg bg-amber-400 text-black font-bold text-sm disabled:opacity-40"
        >
          {busy ? "Resetting…" : "Reset password"}
        </button>
      </form>
    </AuthLayout>
  );
}