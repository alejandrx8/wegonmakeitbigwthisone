import { Direction, GameState, GRID_SIZE, Position } from "./types";

export function generateFood(snake: Position[]): Position {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some((s) => s.x === food.x && s.y === food.y));
  return food;
}

export function getInitialState(highScore: number): GameState {
  const snake: Position[] = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  return {
    snake,
    food: generateFood(snake),
    direction: "RIGHT",
    nextDirection: "RIGHT",
    score: 0,
    highScore,
    status: "idle",
    level: 1,
    foodsEaten: 0,
  };
}

export function moveSnake(state: GameState): GameState {
  const { snake, food, nextDirection, score, highScore, level, foodsEaten } = state;
  const direction = nextDirection;

  const head = snake[0];
  const newHead: Position = { ...head };

  switch (direction) {
    case "UP":    newHead.y -= 1; break;
    case "DOWN":  newHead.y += 1; break;
    case "LEFT":  newHead.x -= 1; break;
    case "RIGHT": newHead.x += 1; break;
  }

  // Wall collision
  if (
    newHead.x < 0 || newHead.x >= GRID_SIZE ||
    newHead.y < 0 || newHead.y >= GRID_SIZE
  ) {
    return { ...state, status: "gameover", highScore: Math.max(score, highScore) };
  }

  // Self collision (skip tail since it will move)
  if (snake.slice(0, -1).some((s) => s.x === newHead.x && s.y === newHead.y)) {
    return { ...state, status: "gameover", highScore: Math.max(score, highScore) };
  }

  const ateFood = newHead.x === food.x && newHead.y === food.y;
  const newSnake = ateFood
    ? [newHead, ...snake]
    : [newHead, ...snake.slice(0, -1)];

  const newFoodsEaten = ateFood ? foodsEaten + 1 : foodsEaten;
  const newScore = ateFood ? score + level * 10 : score;
  const newLevel = Math.floor(newFoodsEaten / 5) + 1;
  const newHighScore = Math.max(newScore, highScore);

  // Win condition: snake fills the entire board
  const maxLength = GRID_SIZE * GRID_SIZE;
  if (ateFood && newSnake.length >= maxLength) {
    return {
      ...state,
      snake: newSnake,
      food: newHead, // hide food under head
      direction,
      score: newScore,
      highScore: newHighScore,
      level: newLevel,
      foodsEaten: newFoodsEaten,
      status: "won",
    };
  }

  const newFood = ateFood ? generateFood(newSnake) : food;

  return {
    ...state,
    snake: newSnake,
    food: newFood,
    direction,
    score: newScore,
    highScore: newHighScore,
    level: newLevel,
    foodsEaten: newFoodsEaten,
    status: "playing",
  };
}

export function getOppositeDirection(dir: Direction): Direction {
  switch (dir) {
    case "UP": return "DOWN";
    case "DOWN": return "UP";
    case "LEFT": return "RIGHT";
    case "RIGHT": return "LEFT";
  }
}

export function isValidDirectionChange(current: Direction, next: Direction): boolean {
  return next !== getOppositeDirection(current);
}
