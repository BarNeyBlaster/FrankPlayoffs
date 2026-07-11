import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Users } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ConferencePicker from "@/components/ConferencePicker";
import PlayoffBracket from "@/components/PlayoffBracket";
import { getTeamById } from "@/data/nflTeams";

const EMPTY_SEEDS = () => Array(7).fill(null);
const EMPTY_PICKS = () => ({ afc: {}, nfc: {}, sb: null });

// Downstream clearing when a pick changes
const DOWNSTREAM = {
  wc1: ["div1", "div2", "cc"],
  wc2: ["div1", "div2", "cc"],
  wc3: ["div1", "div2", "cc"],
  div1: ["cc"],
  div2: ["cc"],
  cc: [],
};

export default function Home() {
  const [afcSeeds, setAfcSeeds] = useState(EMPTY_SEEDS());
  const [nfcSeeds, setNfcSeeds] = useState(EMPTY_SEEDS());
  const [picks, setPicks] = useState(EMPTY_PICKS());
  const [nickname, setNickname] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedList, setSavedList] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const bothReady = afcSeeds.every(Boolean) && nfcSeeds.every(Boolean);

  const loadSaved = async () => {
    try {
      const res = await base44.entities.Prediction.list("-created_date", 10);
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

  const handlePick = (conf, gameKey, teamId) => {
    setPicks((prev) => {
      const next = { ...prev, [conf]: { ...prev[conf] } };
      if (conf === "sb") {
        next.sb = teamId;
        return next;
      }
      // toggle off if same
      if (next[conf][gameKey] === teamId) {
        delete next[conf][gameKey];
      } else {
        next[conf][gameKey] = teamId;
      }
      // clear downstream
      const toClear = DOWNSTREAM[gameKey] || [];
      toClear.forEach((k) => delete next[conf][k]);
      next.sb = null;
      return next;
    });
  };

  // Clear bracket picks if seeds change and break validity
  const handleSeedsChange = (conf, newSeeds) => {
    if (conf === "AFC") setAfcSeeds(newSeeds);
    else setNfcSeeds(newSeeds);
    // Reset all picks since seed changes invalidate the bracket
    setPicks(EMPTY_PICKS());
  };

  const champion = picks.sb ? getTeamById(picks.sb) : null;

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

  const handleReset = () => {
    setAfcSeeds(EMPTY_SEEDS());
    setNfcSeeds(EMPTY_SEEDS());
    setPicks(EMPTY_PICKS());
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

        {/* Saved predictions */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <Users className="w-5 h-5 text-white/40" />
            <h2 className="text-lg font-bold">Recent Predictions</h2>
          </div>
          {loadingSaved ? (
            <div className="text-center py-8 text-white/30 text-sm">Loading...</div>
          ) : savedList.length === 0 ? (
            <div className="text-center py-8 text-white/30 text-sm border border-dashed border-white/10 rounded-xl">
              No predictions yet — be the first to lock one in!
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedList.map((p) => {
                const champ = getTeamById(p.champion);
                return (
                  <div key={p.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white/90">{p.nickname}</span>
                      <Trophy className="w-3.5 h-3.5 text-amber-400/60" />
                    </div>
                    {champ && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-bold font-mono"
                          style={{ background: `linear-gradient(135deg, ${champ.primary}, ${champ.secondary})`, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
                        >
                          {champ.abbr}
                        </div>
                        <span className="text-xs text-white/60">{champ.city} {champ.name}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {(afcSeeds.some(Boolean) || nfcSeeds.some(Boolean)) && (
          <div className="text-center mt-10">
            <button onClick={handleReset} className="text-xs text-white/40 hover:text-white/70 underline underline-offset-4">
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