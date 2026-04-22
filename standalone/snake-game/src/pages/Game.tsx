import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import GameBoard from "@/components/GameBoard";
import ScorePanel from "@/components/ScorePanel";
import GameOverlay from "@/components/GameOverlay";
import MobileControls from "@/components/MobileControls";
import { GameState, getSpeed, GRID_SIZE, CELL_SIZE } from "@/game/types";
import { getInitialState, isValidDirectionChange, moveSnake } from "@/game/logic";
import { Direction } from "@/game/types";

const HIGH_SCORE_KEY = "snake_high_score";
const BOARD_PX = GRID_SIZE * CELL_SIZE;

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
  const [boardScale, setBoardScale] = useState(1);
  const floatIdRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  // Compute board scale to fit the viewport (portrait mobile-first)
  useLayoutEffect(() => {
    const computeScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // Reserve space for: header (~44), score (~56), controls (~210), gaps & padding (~60)
      const reservedV = 44 + 56 + 210 + 60;
      const availableW = vw - 16; // 8px side padding x2
      const availableH = vh - reservedV;
      const target = Math.min(availableW, availableH, 520);
      const scale = Math.max(0.4, target / BOARD_PX);
      setBoardScale(scale);
    };
    computeScale();
    window.addEventListener("resize", computeScale);
    window.addEventListener("orientationchange", computeScale);
    return () => {
      window.removeEventListener("resize", computeScale);
      window.removeEventListener("orientationchange", computeScale);
    };
  }, []);

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
        try {
          navigator.vibrate?.([60, 40, 120, 40, 200]);
        } catch {
          // ignore
        }
      }

      if (next.score > prev.score) {
        const head = next.snake[0];
        const id = ++floatIdRef.current;
        const value = next.score - prev.score;
        setFloatingScores((fs) => [...fs, { id, x: head.x, y: head.y, value }]);
        setTimeout(() => {
          setFloatingScores((fs) => fs.filter((f) => f.id !== id));
        }, 900);

        // Stronger buzz on level-up, lighter on each food
        const leveledUp = next.level > prev.level;
        try {
          navigator.vibrate?.(leveledUp ? [30, 30, 60] : 25);
        } catch {
          // ignore
        }
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

  // Swipe controls on the board for touch devices
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  }, []);
  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchRef.current;
      if (!start) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      const ax = Math.abs(dx);
      const ay = Math.abs(dy);
      const threshold = 20;
      if (Math.max(ax, ay) < threshold) return;
      if (ax > ay) handleDirection(dx > 0 ? "RIGHT" : "LEFT");
      else handleDirection(dy > 0 ? "DOWN" : "UP");
      touchRef.current = null;
    },
    [handleDirection]
  );

  const scaledSize = BOARD_PX * boardScale;

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center px-2 py-2 select-none overflow-hidden">
      <div className="flex flex-col items-center gap-2 w-full max-w-md flex-1">
        <h1 className="text-2xl font-bold tracking-[0.3em] font-mono text-primary drop-shadow-[0_0_12px_hsl(142_76%_48%/0.6)]">
          SNAKE
        </h1>

        <ScorePanel
          score={gameState.score}
          highScore={gameState.highScore}
          level={gameState.level}
        />

        <div
          className="relative"
          style={{ width: scaledSize, height: scaledSize }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            style={{
              transform: `scale(${boardScale})`,
              transformOrigin: "top left",
              width: BOARD_PX,
              height: BOARD_PX,
            }}
          >
            <GameBoard gameState={gameState} floatingScores={floatingScores} />
          </div>
          <GameOverlay
            status={gameState.status}
            score={gameState.score}
            highScore={gameState.highScore}
            onStart={handleStart}
            onPause={handlePause}
          />
        </div>

        <MobileControls onDirection={handleDirection} status={gameState.status} onStart={handleStart} onPause={handlePause} />
      </div>
    </div>
  );
}
