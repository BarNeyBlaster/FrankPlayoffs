import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ConferencePicker from "@/components/ConferencePicker";
import PlayoffBracket from "@/components/PlayoffBracket";
import Leaderboard from "@/components/Leaderboard";
import TopNav from "@/components/TopNav";
import { useBracket } from "@/hooks/useBracket";

export default function Home() {
  const { afcSeeds, nfcSeeds, picks, bothReady, champion, handlePick, handleSeedsChange, reset } = useBracket();
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedList, setSavedList] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const loadSaved = async () => {
    try {
      const res = await base44.entities.Prediction.list("-created_date", 50);
      setSavedList(res || []);
    } catch {
      setSavedList([]);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  const handleSave = async () => {
    if (!bothReady || !champion) return;
    if (!nickname.trim()) return;
    setSaving(true);
    try {
      await base44.entities.Prediction.create({
        nickname: nickname.trim(),
        afc_seeds: afcSeeds,
        nfc_seeds: nfcSeeds,
        picks,
        champion: champion.id,
        champion_name: `${champion.city} ${champion.name}`,
      });
      setNickname("");
      await loadSaved();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ background: "#E31837" }} />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ background: "#0B5FBF" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[100px] opacity-10" style={{ background: "#FFD700" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <TopNav />
        {/* Hero */}
        <header className="text-center mb-10 md:mb-14">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-4">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">NFL Playoff Predictor</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-6xl font-black tracking-tighter mb-3">
            Predict the <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">Playoffs</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-sm md:text-base text-white/50 max-w-xl mx-auto">
            Pick 7 teams from each conference, seed them 1–7, then play out your bracket all the way to a Super Bowl champion.
          </motion.p>
        </header>

        {/* Step 1: Selection */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">1</span>
            <h2 className="text-lg font-bold">Seed the Field</h2>
            <span className="text-xs text-white/40">Select & rank 7 teams per conference</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <ConferencePicker conference="AFC" seeds={afcSeeds} onChange={(s) => handleSeedsChange("AFC", s)} />
            <ConferencePicker conference="NFC" seeds={nfcSeeds} onChange={(s) => handleSeedsChange("NFC", s)} />
          </div>
        </section>

        {/* Step 2: Bracket */}
        <AnimatePresence>
          {bothReady && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">2</span>
                <h2 className="text-lg font-bold">Play Your Bracket</h2>
                <span className="text-xs text-white/40">Click winners round by round</span>
              </div>
              <PlayoffBracket afcSeeds={afcSeeds} nfcSeeds={nfcSeeds} picks={picks} onPick={handlePick} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Step 3: Save */}
        <AnimatePresence>
          {champion && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-10"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">3</span>
                <h2 className="text-lg font-bold">Lock It In</h2>
              </div>
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] p-5 md:p-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs text-white/50 mb-1">Your predicted Super Bowl champion:</p>
                  <p className="text-xl font-black" style={{ color: champion.primary === "#000000" ? "#fff" : champion.primary }}>
                    {champion.city} {champion.name}
                  </p>
                </div>
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="Your name"
                  className="w-full sm:w-44 px-4 py-2.5 rounded-lg bg-black/30 border border-white/10 text-sm placeholder:text-white/30 focus:outline-none focus:border-amber-400/50"
                />
                <button
                  onClick={handleSave}
                  disabled={saving || !nickname.trim()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-sm hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {saving ? "Saving..." : "Save Prediction"}
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Leaderboard */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Trophy className="w-5 h-5 text-amber-400/70" />
            <h2 className="text-lg font-bold">Leaderboard</h2>
            <span className="text-xs text-white/40">Ranked by correct picks</span>
          </div>
          {loadingSaved ? (
            <div className="text-center py-8 text-white/30 text-sm">Loading…</div>
          ) : (
            <Leaderboard predictions={savedList} />
          )}
        </section>

        {(afcSeeds.some(Boolean) || nfcSeeds.some(Boolean)) && (
          <div className="text-center mt-10">
            <button onClick={reset} className="text-xs text-white/40 hover:text-white/70 underline underline-offset-4">
              Reset everything
            </button>
          </div>
        )}

        <footer className="text-center mt-16 pb-4">
          <p className="text-[11px] text-white/20">Unofficial fan project · All team names and colors belong to their respective owners</p>
        </footer>
      </div>
    </div>
  );
}