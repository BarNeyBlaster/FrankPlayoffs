import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Users } from "lucide-react";
import { base44 } from "../api/base44Client";
import TopNav from "../components/TopNav";
import ResultsEditor from "../components/ResultsEditor";
import PredictionsManager from "../components/PredictionsManager";

export default function Results() {
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.entities.OfficialResult.list("-updated_date", 1);
        if (res && res[0]) setExisting(res[0]);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ background: "#FFD700" }} />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[120px] opacity-15" style={{ background: "#0B5FBF" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <TopNav />

        <header className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Official Results</span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2">Lock In the Real Field</h1>
          <p className="text-sm text-white/50 max-w-xl mx-auto">
            Enter the actual playoff field and results. Once saved, every saved prediction is scored and the leaderboard updates automatically.
          </p>
        </header>

        <ResultsEditor initial={existing} onSaved={(rec) => setExisting(rec)} />

        <section className="mt-12">
          <div className="flex items-center gap-3 mb-5">
            <Users className="w-5 h-5 text-amber-400/70" />
            <h2 className="text-lg font-bold">Manage Predictions</h2>
            <span className="text-xs text-white/40">Delete any submitted bracket</span>
          </div>
          <PredictionsManager />
        </section>

        <footer className="text-center mt-16 pb-4">
          <p className="text-[11px] text-white/20">Unofficial fan project · All team names and colors belong to their respective owners</p>
        </footer>
      </div>
    </div>
  );
}