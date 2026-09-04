// All 32 NFL teams with branding metadata.
// Each team: { id, city, name, abbr, conference, division, primary, secondary }

export const TEAMS = [
  // AFC East
  { id: "BUF", city: "Buffalo", name: "Bills", abbr: "BUF", conference: "AFC", division: "East", primary: "#00338D", secondary: "#C60C30" },
  { id: "MIA", city: "Miami", name: "Dolphins", abbr: "MIA", conference: "AFC", division: "East", primary: "#008E97", secondary: "#FC4C02" },
  { id: "NE", city: "New England", name: "Patriots", abbr: "NE", conference: "AFC", division: "East", primary: "#002244", secondary: "#C60C30" },
  { id: "NYJ", city: "New York", name: "Jets", abbr: "NYJ", conference: "AFC", division: "East", primary: "#125740", secondary: "#FFFFFF" },
  // AFC North
  { id: "BAL", city: "Baltimore", name: "Ravens", abbr: "BAL", conference: "AFC", division: "North", primary: "#241773", secondary: "#000000" },
  { id: "CIN", city: "Cincinnati", name: "Bengals", abbr: "CIN", conference: "AFC", division: "North", primary: "#FB4F14", secondary: "#000000" },
  { id: "CLE", city: "Cleveland", name: "Browns", abbr: "CLE", conference: "AFC", division: "North", primary: "#311D00", secondary: "#FF3C00" },
  { id: "PIT", city: "Pittsburgh", name: "Steelers", abbr: "PIT", conference: "AFC", division: "North", primary: "#FFB612", secondary: "#000000" },
  // AFC South
  { id: "HOU", city: "Houston", name: "Texans", abbr: "HOU", conference: "AFC", division: "South", primary: "#03202F", secondary: "#A71930" },
  { id: "IND", city: "Indianapolis", name: "Colts", abbr: "IND", conference: "AFC", division: "South", primary: "#002C5F", secondary: "#FFFFFF" },
  { id: "JAX", city: "Jacksonville", name: "Jaguars", abbr: "JAX", conference: "AFC", division: "South", primary: "#101820", secondary: "#006778" },
  { id: "TEN", city: "Tennessee", name: "Titans", abbr: "TEN", conference: "AFC", division: "South", primary: "#0C2340", secondary: "#4B92DB" },
  // AFC West
  { id: "DEN", city: "Denver", name: "Broncos", abbr: "DEN", conference: "AFC", division: "West", primary: "#FB4F14", secondary: "#002244" },
  { id: "KC", city: "Kansas City", name: "Chiefs", abbr: "KC", conference: "AFC", division: "West", primary: "#E31837", secondary: "#FFB81C" },
  { id: "LV", city: "Las Vegas", name: "Raiders", abbr: "LV", conference: "AFC", division: "West", primary: "#000000", secondary: "#A5ACAF" },
  { id: "LAC", city: "Los Angeles", name: "Chargers", abbr: "LAC", conference: "AFC", division: "West", primary: "#0080C5", secondary: "#FFC20E" },
  // NFC East
  { id: "DAL", city: "Dallas", name: "Cowboys", abbr: "DAL", conference: "NFC", division: "East", primary: "#003594", secondary: "#869397" },
  { id: "NYG", city: "New York", name: "Giants", abbr: "NYG", conference: "NFC", division: "East", primary: "#0B2265", secondary: "#A71930" },
  { id: "PHI", city: "Philadelphia", name: "Eagles", abbr: "PHI", conference: "NFC", division: "East", primary: "#004C54", secondary: "#A5ACAF" },
  { id: "WSH", city: "Washington", name: "Commanders", abbr: "WSH", conference: "NFC", division: "East", primary: "#5A1414", secondary: "#FFB612" },
  // NFC North
  { id: "CHI", city: "Chicago", name: "Bears", abbr: "CHI", conference: "NFC", division: "North", primary: "#0B2265", secondary: "#C83803" },
  { id: "DET", city: "Detroit", name: "Lions", abbr: "DET", conference: "NFC", division: "North", primary: "#0076B1", secondary: "#B0B7BC" },
  { id: "GB", city: "Green Bay", name: "Packers", abbr: "GB", conference: "NFC", division: "North", primary: "#203731", secondary: "#FFB612" },
  { id: "MIN", city: "Minnesota", name: "Vikings", abbr: "MIN", conference: "NFC", division: "North", primary: "#4F2683", secondary: "#FFC62F" },
  // NFC South
  { id: "ATL", city: "Atlanta", name: "Falcons", abbr: "ATL", conference: "NFC", division: "South", primary: "#A71930", secondary: "#000000" },
  { id: "CAR", city: "Carolina", name: "Panthers", abbr: "CAR", conference: "NFC", division: "South", primary: "#0085CA", secondary: "#101820" },
  { id: "NO", city: "New Orleans", name: "Saints", abbr: "NO", conference: "NFC", division: "South", primary: "#D3BC8D", secondary: "#101820" },
  { id: "TB", city: "Tampa Bay", name: "Buccaneers", abbr: "TB", conference: "NFC", division: "South", primary: "#D50A0A", secondary: "#34302B" },
  // NFC West
  { id: "ARI", city: "Arizona", name: "Cardinals", abbr: "ARI", conference: "NFC", division: "West", primary: "#97233F", secondary: "#000000" },
  { id: "LAR", city: "Los Angeles", name: "Rams", abbr: "LAR", conference: "NFC", division: "West", primary: "#003594", secondary: "#FFA300" },
  { id: "SF", city: "San Francisco", name: "49ers", abbr: "SF", conference: "NFC", division: "West", primary: "#AA0000", secondary: "#B3995D" },
  { id: "SEA", city: "Seattle", name: "Seahawks", abbr: "SEA", conference: "NFC", division: "West", primary: "#002244", secondary: "#69BE28" },
];

export const DIVISIONS = ["East", "North", "South", "West"];

export function getTeamById(id) {
  return TEAMS.find((t) => t.id === id);
}

export function getTeamsByConference(conference) {
  return TEAMS.filter((t) => t.conference === conference);
}