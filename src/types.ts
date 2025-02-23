export interface Match {
  id: string;
  title: string;
  format: 'T20' | 'ODI' | 'Test';
  status: string;
  venue: string;
  date: string;
  teams: {
    team1: string;
    team2: string;
    score1?: string;
    score2?: string;
  };
}

export interface Player {
  id: string;
  name: string;
  team: string;
  role: string;
  battingAvg: number;
  bowlingAvg: number;
  matches: number;
  imageUrl: string;
}

export interface TeamRanking {
  team: string;
  rank: number;
  points: number;
  rating: number;
}