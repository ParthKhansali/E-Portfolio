export interface VisitorProfile {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

export interface GameScorePayload {
  game: "runner" | "snake" | "pong" | "reflex";
  score: number;
}

export interface LeaderboardEntry {
  id: string;
  player: string;
  avatar: string;
  score: number;
  date: string;
  game: "runner" | "snake" | "pong" | "reflex" | "skribbl";
}
