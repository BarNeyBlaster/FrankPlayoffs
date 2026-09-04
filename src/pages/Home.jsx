import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, Save } from "lucide-react";
import { base44 } from "../api/base44Client";
import { useBracket } from "../hooks/useBracket";
import { getTeamById } from "../data/nflTeams";
import ConferencePicker from "../components/ConferencePicker";
import TiebreakerPicker from "../components/TiebreakerPicker";
import Leaderboard from "../components/Leaderboard";
import TopNav from "../components/TopNav";

export default function Home() {
  const bracket = useBracket();
  const [nickname, setNickname] = useState("");
  const [tbChamp, setTbChamp] = useState(null);
  const [score, setScore] = useState("");
  const [existing, setExisting] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.entities.Prediction.list("-updated_date", 1);
        if (res && res[0]) {
          setExisting(res[0]);
          setNickname(res[0].nickname || "");
          if (res[0].afc_seeds) bracket.handleSeedsChange("AFC", res[0].afc_seeds);
          if (res[0].nfc_seeds) bracket.handleSeedsChange("NFC", res[0].nfc_seeds);
          setTbChamp(res[0].sb_champion || null);
          if (res[0].sb_score_champ != null && res[0].sb_score_opp != null) {
            setScore(`${res[0].sb_score_champ}-${res[0].sb_score_opp}`);
          }
        }
      } catch {
        /* ignore */
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bothReady = bracket.bothReady;
  const scoreOk = /^\d{1,3}-\d{1,3}$/.test(score.trim());
  const tbReady = bothReady && !!tbChamp && scoreOk;
  const fieldTeams = [...bracket.afcSeeds, ...bracket.nfcSeeds].filter(Boolean).map(getTeamById);

  useEffect(() => {
    if (tbChamp && ![...bracket.afcSeeds, ...bracket.nfcSeeds].includes(tbChamp)) setTbChamp(null);
  }, [bracket.afcSeeds, bracket.nfcSeeds, tbChamp]);

  const handleSave = async () => {
    if (!tbReady || !nickname.trim()) return;
    const [sc, so] = score.trim().split("-").map((n) => parseInt(n, 10));
    if (isNaN(sc) || isNaN(so)) return;
    setSaving(true);
    setErrMsg("");
    const payload = {
      nickname: nickname.trim(),
      afc_seeds: bracket.afcSeeds,
      nfc_seeds: bracket.nfcSeeds,
      sb_champion: tbChamp,
      sb_score_champ: sc,
      sb_score_opp: so,
    };
    try {
      let rec;
      if (existing && existing.id) {
        rec = await base44.entities.Prediction.update(existing.id, payload);
      } else {
        rec = await base44.entities.Prediction.create(payload);
      }
      setExisting(rec);
      setMsg("Saved!");
      setTimeout(() => setMsg(""), 2500);
    } catch (e) {
      setErrMsg((e && (e.message || e.error)) || "Could not save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    bracket.reset();
    setTbChamp(null);
    setScore("");
    setNickname("");
    setExisting(null);
  };

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
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">NFL Playoff Predictor</span>
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2">
            Predict the <span className="text-amber-400">Playoffs</span>
          </h1>
          <p className="text-sm text-white/50 max-w-xl mx-auto">
            Pick 7 teams from each conference to guess the playoff field, then call the Super Bowl champion and final score as a tie-breaker.
          </p>
        </header>

        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center text-[11px] font-bold text-amber-400">1</span>
            <h2 className="text-base font-bold">Pick the Field</h2>
            <span className="text-xs text-white/40">Select 7 teams per conference.</span>
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <ConferencePicker conference="AFC" seeds={bracket.afcSeeds} onChange={(s) => bracket.handleSeedsChange("AFC", s)} />
            <ConferencePicker conference="NFC" seeds={bracket.nfcSeeds} onChange={(s) => bracket.handleSeedsChange("NFC", s)} />
          </div>
        </section>

        {bothReady && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center text-[11px] font-bold text-amber-400">2</span>
              <h2 className="text-base font-bold">Tie-Breaker</h2>
              <span className="text-xs text-white/40">Pick the champion and final score.</span>
            </div>
            <TiebreakerPicker
              teams={fieldTeams}
              champion={tbChamp}
              score={score}
              onChampion={setTbChamp}
              onScore={setScore}
            />
          </section>
        )}

        <section className="mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your name"
              className="w-full sm:w-64 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-amber-400/50"
            />
            <button
              onClick={handleSave}
              disabled={!tbReady || !nickname.trim() || saving}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-sm hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save Prediction"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          </div>
          {msg && <p className="text-center text-emerald-400 text-sm mt-3">{msg}</p>}
          {errMsg && <p className="text-center text-red-400 text-sm mt-3">{errMsg}</p>}
          {!tbReady && bothReady && (
            <p className="text-center text-xs text-white/40 mt-3">Pick a champion and enter a final score (e.g. 24-9) to save.</p>
          )}
        </section>

        <section className="mt-12">
          <Leaderboard />
        </section>

        <footer className="text-center mt-16 pb-4">
          <p className="text-[11px] text-white/20">Unofficial fan project · All team names and colors belong to their respective owners</p>
        </footer>
      </div>
    </div>
  );
}