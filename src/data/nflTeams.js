// All 32 NFL teams with conference, division, and brand colors.
export const NFL_TEAMS = [
  // AFC East
  { id: "BUF", name: "Bills", city: "Buffalo", abbr: "BUF", conference: "AFC", division: "East", primary: "#00338D", secondary: "#C60C30" },
  { id: "MIA", name: "Dolphins", city: "Miami", abbr: "MIA", conference: "AFC", division: "East", primary: "#008E97", secondary: "#FC4C02" },
  { id: "NE", name: "Patriots", city: "New England", abbr: "NE", conference: "AFC", division: "East", primary: "#002244", secondary: "#C60C30" },
  { id: "NYJ", name: "Jets", city: "New York", abbr: "NYJ", conference: "AFC", division: "East", primary: "#125740", secondary: "#FFFFFF" },
  // AFC North
  { id: "BAL", name: "Ravens", city: "Baltimore", abbr: "BAL", conference: "AFC", division: "North", primary: "#241773", secondary: "#9E7C0C" },
  { id: "CIN", name: "Bengals", city: "Cincinnati", abbr: "CIN", conference: "AFC", division: "North", primary: "#FB4F14", secondary: "#000000" },
  { id: "CLE", name: "Browns", city: "Cleveland", abbr: "CLE", conference: "AFC", division: "North", primary: "#311D00", secondary: "#FF3C00" },
  { id: "PIT", name: "Steelers", city: "Pittsburgh", abbr: "PIT", conference: "AFC", division: "North", primary: "#FFB612", secondary: "#000000" },
  // AFC South
  { id: "HOU", name: "Texans", city: "Houston", abbr: "HOU", conference: "AFC", division: "South", primary: "#03202F", secondary: "#A71930" },
  { id: "IND", name: "Colts", city: "Indianapolis", abbr: "IND", conference: "AFC", division: "South", primary: "#002C5F", secondary: "#A2AAAD" },
  { id: "JAX", name: "Jaguars", city: "Jacksonville", abbr: "JAX", conference: "AFC", division: "South", primary: "#101820", secondary: "#D7A22A" },
  { id: "TEN", name: "Titans", city: "Tennessee", abbr: "TEN", conference: "AFC", division: "South", primary: "#0C2340", secondary: "#4B92DB" },
  // AFC West
  { id: "DEN", name: "Broncos", city: "Denver", abbr: "DEN", conference: "AFC", division: "West", primary: "#FB4F14", secondary: "#002244" },
  { id: "KC", name: "Chiefs", city: "Kansas City", abbr: "KC", conference: "AFC", division: "West", primary: "#E31837", secondary: "#FFB612" },
  { id: "LV", name: "Raiders", city: "Las Vegas", abbr: "LV", conference: "AFC", division: "West", primary: "#000000", secondary: "#A5ACAF" },
  { id: "LAC", name: "Chargers", city: "Los Angeles", abbr: "LAC", conference: "AFC", division: "West", primary: "#0080C6", secondary: "#FFC20E" },
  // NFC East
  { id: "DAL", name: "Cowboys", city: "Dallas", abbr: "DAL", conference: "NFC", division: "East", primary: "#003594", secondary: "#869397" },
  { id: "NYG", name: "Giants", city: "New York", abbr: "NYG", conference: "NFC", division: "East", primary: "#0B2265", secondary: "#A71930" },
  { id: "PHI", name: "Eagles", city: "Philadelphia", abbr: "PHI", conference: "NFC", division: "East", primary: "#004C54", secondary: "#A5ACAF" },
  { id: "WAS", name: "Commanders", city: "Washington", abbr: "WAS", conference: "NFC", division: "East", primary: "#5A1414", secondary: "#FFB612" },
  // NFC North
  { id: "CHI", name: "Bears", city: "Chicago", abbr: "CHI", conference: "NFC", division: "North", primary: "#0B162A", secondary: "#C83803" },
  { id: "DET", name: "Lions", city: "Detroit", abbr: "DET", conference: "NFC", division: "North", primary: "#0076B6", secondary: "#B0B7BC" },
  { id: "GB", name: "Packers", city: "Green Bay", abbr: "GB", conference: "NFC", division: "North", primary: "#203731", secondary: "#FFB612" },
  { id: "MIN", name: "Vikings", city: "Minnesota", abbr: "MIN", conference: "NFC", division: "North", primary: "#4F2683", secondary: "#FFC62F" },
  // NFC South
  { id: "ATL", name: "Falcons", city: "Atlanta", abbr: "ATL", conference: "NFC", division: "South", primary: "#A71930", secondary: "#000000" },
  { id: "CAR", name: "Panthers", city: "Carolina", abbr: "CAR", conference: "NFC", division: "South", primary: "#0085CA", secondary: "#101820" },
  { id: "NO", name: "Saints", city: "New Orleans", abbr: "NO", conference: "NFC", division: "South", primary: "#D3BC8D", secondary: "#101820" },
  { id: "TB", name: "Buccaneers", city: "Tampa Bay", abbr: "TB", conference: "NFC", division: "South", primary: "#D50A0A", secondary: "#34302B" },
  // NFC West
  { id: "ARI", name: "Cardinals", city: "Arizona", abbr: "ARI", conference: "NFC", division: "West", primary: "#97233F", secondary: "#000000" },
  { id: "LAR", name: "Rams", city: "Los Angeles", abbr: "LAR", conference: "NFC", division: "West", primary: "#003594", secondary: "#FFD100" },
  { id: "SF", name: "49ers", city: "San Francisco", abbr: "SF", conference: "NFC", division: "West", primary: "#AA0000", secondary: "#B3995D" },
  { id: "SEA", name: "Seahawks", city: "Seattle", abbr: "SEA", conference: "NFC", division: "West", primary: "#002244", secondary: "#69BE28" },
];

export const DIVISIONS = ["East", "North", "South", "West"];

export const getTeamById = (id) => NFL_TEAMS.find((t) => t.id === id);
export const getTeamsByConference = (conf) => NFL_TEAMS.filter((t) => t.conference === conf);

// Build the conference playoff bracket from seeds + picks.
// seeds: array of 7 team ids (index 0 = #1 seed)
// picks: { wc1, wc2, wc3, div1, div2, cc } -> winner team id
export function buildConfBracket(seeds, picks) {
  const seed = (n) => (seeds[n - 1] ? getTeamById(seeds[n - 1]) : null);

  const wcGames = [
    { key: "wc1", teamA: seed(2), teamB: seed(7), winnerId: picks.wc1 || null, seedA: 2, seedB: 7 },
    { key: "wc2", teamA: seed(3), teamB: seed(6), winnerId: picks.wc2 || null, seedA: 3, seedB: 6 },
    { key: "wc3", teamA: seed(4), teamB: seed(5), winnerId: picks.wc3 || null, seedA: 4, seedB: 5 },
  ];

  const wcWinnerList = wcGames
    .filter((g) => g.winnerId)
    .map((g) => ({
      team: g.teamA.id === g.winnerId ? g.teamA : g.teamB,
      seedNum: g.teamA.id === g.winnerId ? g.seedA : g.seedB,
    }));

  // #1 seed plays the worst remaining (highest seed number); other two play each other
  const sorted = [...wcWinnerList].sort((a, b) => a.seedNum - b.seedNum);
  const div1 = {
    key: "div1",
    teamA: seed(1),
    teamB: sorted[2] ? sorted[2].team : null,
    winnerId: picks.div1 || null,
    seedA: 1,
    seedB: sorted[2] ? sorted[2].seedNum : null,
  };
  const div2 = {
    key: "div2",
    teamA: sorted[0] ? sorted[0].team : null,
    teamB: sorted[1] ? sorted[1].team : null,
    winnerId: picks.div2 || null,
    seedA: sorted[0] ? sorted[0].seedNum : null,
    seedB: sorted[1] ? sorted[1].seedNum : null,
  };

  const cc = {
    key: "cc",
    teamA: div1.winnerId ? getTeamById(div1.winnerId) : null,
    teamB: div2.winnerId ? getTeamById(div2.winnerId) : null,
    winnerId: picks.cc || null,
  };

  return { wcGames, div1, div2, cc };
}

export function getChampionTeam(picks) {
  return picks.sb ? getTeamById(picks.sb) : null;
}