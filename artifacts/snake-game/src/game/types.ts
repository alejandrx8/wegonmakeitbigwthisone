export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface Position {
  x: number;
  y: number;
}

export type GameStatus = "idle" | "playing" | "paused" | "gameover" | "won";

export interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  score: number;
  highScore: number;
  status: GameStatus;
  level: number;
  foodsEaten: number;
}

export const GRID_SIZE = 20;
export const CELL_SIZE = 24;
export const FOODS_PER_LEVEL = 5;

export const SPEED_BY_LEVEL: Record<number, number> = {
  1: 160,
  2: 140,
  3: 120,
  4: 100,
  5: 85,
  6: 70,
  7: 58,
  8: 48,
  9: 40,
  10: 34,
};

export function getSpeed(level: number): number {
  return SPEED_BY_LEVEL[Math.min(level, 10)] ?? 34;
}
