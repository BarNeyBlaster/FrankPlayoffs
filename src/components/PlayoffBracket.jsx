import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { buildConfBracket, getTeamById } from "@/data/nflTeams";
import BracketGame from "./BracketGame";

const AFC_COLOR = "#E31837";
const NFC_COLOR = "#0B5FBF";

function ConfColumn({ title, seeds, confPicks, confColor, onPick, reverse }) {
  const { wcGames, div1, div2, cc } = buildConfBracket(seeds, confPicks);
  const rounds = [
    { label: "Wild Card", games: wcGames },
    { label: "Divisional", games: [div2, div1] },
    { label: "Conf Champ", games: [cc] },
  ];

  return (
    <div className="flex flex-col gap-4 min-w-0">
      <div className="text-center">
        <span className="text-lg font-black tracking-tight" style={{ color: confColor }}>{title}</span>
      </div>
      {rounds.map((round, ri) => (
        <div key={ri} className="flex flex-col gap-3">
          <p className="text-[9px] uppercase tracking-wider text-white/30 text-center">{round.label}</p>
          <div className="flex flex-col gap-3 justify-around flex-1">
            {round.games.map((g, gi) => (
              <BracketGame
                key={`${ri}-${gi}`}
                teamA={g.teamA}
                teamB={g.teamB}
                winnerId={g.winnerId}
                seedA={g.seedA}
                seedB={g.seedB}
                conferenceColor={confColor}
                onPick={(teamId) => onPick(g.key, teamId)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PlayoffBracket({ afcSeeds, nfcSeeds, picks, onPick }) {
  const afcChamp = picks.afc.cc ? getTeamById(picks.afc.cc) : null;
  const nfcChamp = picks.nfc.cc ? getTeamById(picks.nfc.cc) : null;
  const sbReady = afcChamp && nfcChamp;
  const champion = picks.sb ? getTeamById(picks.sb) : null;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-5 md:p-8">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">Playoff Bracket</h2>
        <p className="text-xs text-white/40 mt-1">Click the team you predict to advance each round</p>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex items-stretch gap-4 md:gap-8 min-w-max mx-auto">
          {/* AFC */}
          <div className="w-52 md:w-56">
            <ConfColumn title="AFC" seeds={afcSeeds} confPicks={picks.afc} confColor={AFC_COLOR} onPick={(k, tid) => onPick("afc", k, tid)} />
          </div>

          {/* Super Bowl */}
          <div className="flex flex-col items-center justify-center w-44 md:w-52">
            <p className="text-[9px] uppercase tracking-wider text-white/30 mb-3">Super Bowl</p>
            <div className="w-full">
              <BracketGame
                teamA={afcChamp}
                teamB={nfcChamp}
                winnerId={picks.sb}
                onPick={(teamId) => onPick("sb", null, teamId)}
                conferenceColor="#FFD700"
              />
            </div>

            {/* Champion display */}
            <div className="mt-6 text-center">
              {champion ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-2"
                >
                  <Trophy className="w-8 h-8 text-amber-400" />
                  <p className="text-[10px] uppercase tracking-wider text-amber-400/70 font-bold">Predicted Champion</p>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl" style={{ background: `linear-gradient(135deg, ${champion.primary}44, ${champion.secondary}33)`, boxShadow: "0 0 30px rgba(255,215,0,0.15)" }}>
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-bold font-mono"
                      style={{ background: `linear-gradient(135deg, ${champion.primary}, ${champion.secondary})`, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
                    >
                      {champion.abbr}
                    </div>
                    <span className="text-sm font-bold text-white">{champion.city} {champion.name}</span>
                  </div>
                </motion.div>
              ) : (
                <div className="text-white/20 text-xs">
                  {sbReady ? "Pick your champion!" : "Complete both conferences"}
                </div>
              )}
            </div>
          </div>

          {/* NFC */}
          <div className="w-52 md:w-56">
            <ConfColumn title="NFC" seeds={nfcSeeds} confPicks={picks.nfc} confColor={NFC_COLOR} onPick={(k, tid) => onPick("nfc", k, tid)} />
          </div>
        </div>
      </div>
    </div>
  );
}