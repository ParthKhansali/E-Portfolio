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
