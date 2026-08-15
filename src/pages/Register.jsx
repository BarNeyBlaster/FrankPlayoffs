import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "../api/base44Client";
import AuthLayout from "../components/AuthLayout";
import GoogleIcon from "../components/GoogleIcon";
import { getReturnTo } from "../lib/authReturnTo";

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const register = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setErr("Passwords don't match.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      await base44.auth.register({ email, password });
      setStep(2);
    } catch (e) {
      setErr((e && (e.message || e.error)) || "Could not register.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const res = await base44.auth.verifyOtp({ email, otpCode: otp });
      await base44.auth.setToken(res.access_token);
      window.location.href = getReturnTo();
    } catch (e) {
      setErr((e && (e.message || e.error)) || "Invalid code.");
      setBusy(false);
    }
  };

  const resend = async () => {
    try {
      await base44.auth.resendOtp(email);
    } catch {
      /* ignore */
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
    <AuthLayout title="Create account" subtitle="Join the predictor">
      {step === 1 ? (
        <>
          <form onSubmit={register} className="space-y-3">
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
              {busy ? "Creating…" : "Create account"}
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
          <p className="text-xs text-white/50 mt-4 text-center">
            <Link to="/login" className="hover:text-white">Already have an account? Sign in</Link>
          </p>
        </>
      ) : (
        <form onSubmit={verify} className="space-y-3">
          <p className="text-sm text-white/60">Enter the code sent to {email}.</p>
          <input
            type="text"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Verification code"
            className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm focus:outline-none focus:border-amber-400/50"
          />
          {err && <p className="text-red-400 text-xs">{err}</p>}
          <button
            disabled={busy}
            className="w-full px-4 py-2 rounded-lg bg-amber-400 text-black font-bold text-sm disabled:opacity-40"
          >
            {busy ? "Verifying…" : "Verify"}
          </button>
          <button
            type="button"
            onClick={resend}
            className="w-full text-xs text-white/50 hover:text-white"
          >
            Resend code
          </button>
        </form>
      )}
    </AuthLayout>
  );
}