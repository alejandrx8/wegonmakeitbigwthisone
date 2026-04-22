import { useCallback, useEffect, useRef, useState } from "react";
import GameBoard from "@/components/GameBoard";
import ScorePanel from "@/components/ScorePanel";
import GameOverlay from "@/components/GameOverlay";
import MobileControls from "@/components/MobileControls";
import { GameState, getSpeed } from "@/game/types";
import { getInitialState, isValidDirectionChange, moveSnake } from "@/game/logic";
import { Direction } from "@/game/types";

const HIGH_SCORE_KEY = "snake_high_score";

function loadHighScore(): number {
  try {
    return parseInt(localStorage.getItem(HIGH_SCORE_KEY) ?? "0", 10) || 0;
  } catch {
    return 0;
  }
}

function saveHighScore(score: number) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // ignore
  }
}

export default function Game() {
  const [gameState, setGameState] = useState<GameState>(() =>
    getInitialState(loadHighScore())
  );
  const [floatingScores, setFloatingScores] = useState<{ id: number; x: number; y: number; value: number }[]>([]);
  const floatIdRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  const clearTick = useCallback(() => {
    if (tickRef.current != null) {
      clearTimeout(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    setGameState((prev) => {
      if (prev.status !== "playing") return prev;
      const next = moveSnake(prev);

      if (next.status === "gameover") {
        saveHighScore(next.highScore);
      }

      // Detect food eaten
      if (next.score > prev.score) {
        const head = next.snake[0];
        const id = ++floatIdRef.current;
        const value = next.score - prev.score;
        setFloatingScores((fs) => [...fs, { id, x: head.x, y: head.y, value }]);
        setTimeout(() => {
          setFloatingScores((fs) => fs.filter((f) => f.id !== id));
        }, 900);
      }

      return next;
    });
  }, []);

  useEffect(() => {
    if (gameState.status !== "playing") {
      clearTick();
      return;
    }
    tickRef.current = setTimeout(() => {
      tick();
    }, getSpeed(gameState.level));
    return clearTick;
  }, [gameState, clearTick, tick]);

  const handleDirection = useCallback((dir: Direction) => {
    setGameState((prev) => {
      if (prev.status !== "playing") return prev;
      if (!isValidDirectionChange(prev.direction, dir)) return prev;
      return { ...prev, nextDirection: dir };
    });
  }, []);

  const handleStart = useCallback(() => {
    setGameState((prev) => {
      if (prev.status === "idle" || prev.status === "gameover") {
        return { ...getInitialState(prev.highScore), status: "playing" };
      }
      return prev;
    });
  }, []);

  const handlePause = useCallback(() => {
    setGameState((prev) => {
      if (prev.status === "playing") return { ...prev, status: "paused" };
      if (prev.status === "paused") return { ...prev, status: "playing" };
      return prev;
    });
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          handleDirection("UP");
          break;
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          handleDirection("DOWN");
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          handleDirection("LEFT");
          break;
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          handleDirection("RIGHT");
          break;
        case " ":
        case "Escape":
          e.preventDefault();
          if (gameStateRef.current.status === "idle" || gameStateRef.current.status === "gameover") {
            handleStart();
          } else {
            handlePause();
          }
          break;
        case "Enter":
          e.preventDefault();
          if (gameStateRef.current.status === "idle" || gameStateRef.current.status === "gameover") {
            handleStart();
          }
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleDirection, handleStart, handlePause]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 select-none">
      <div className="flex flex-col items-center gap-4 w-full max-w-lg">
        <h1 className="text-3xl font-bold tracking-wider font-mono text-primary drop-shadow-[0_0_12px_hsl(142_76%_48%/0.6)]">
          SNAKE
        </h1>

        <ScorePanel
          score={gameState.score}
          highScore={gameState.highScore}
          level={gameState.level}
        />

        <div className="relative">
          <GameBoard gameState={gameState} floatingScores={floatingScores} />
          <GameOverlay
            status={gameState.status}
            score={gameState.score}
            highScore={gameState.highScore}
            onStart={handleStart}
            onPause={handlePause}
          />
        </div>

        <MobileControls onDirection={handleDirection} status={gameState.status} onStart={handleStart} onPause={handlePause} />

        <p className="text-muted-foreground text-xs font-mono mt-1">
          WASD / Arrow keys to move &middot; Space to pause
        </p>
      </div>
    </div>
  );
}
