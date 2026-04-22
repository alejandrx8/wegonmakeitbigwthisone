import { GameStatus } from "@/game/types";

interface Props {
  status: GameStatus;
  score: number;
  highScore: number;
  onStart: () => void;
  onPause: () => void;
}

export default function GameOverlay({ status, score, highScore, onStart, onPause }: Props) {
  if (status === "playing") return null;

  const isNewBest = status === "gameover" && score > 0 && score >= highScore;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(5, 8, 18, 0.82)",
        backdropFilter: "blur(2px)",
        borderRadius: 8,
        gap: 16,
        zIndex: 20,
      }}
    >
      {status === "idle" && (
        <>
          <div className="text-center">
            <div className="text-4xl font-mono font-black text-primary drop-shadow-[0_0_16px_hsl(142_76%_48%/0.7)]">
              SNAKE
            </div>
            <p className="text-muted-foreground text-sm mt-1 font-mono">
              Bet u can&apos;t get to the end lol
            </p>
          </div>
          <button
            onClick={onStart}
            className="px-8 py-3 rounded-lg font-mono font-bold text-sm tracking-widest uppercase transition-all duration-150"
            style={{
              background: "hsl(142 76% 48%)",
              color: "hsl(222 47% 8%)",
              boxShadow: "0 0 20px hsl(142 76% 48% / 0.5)",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.boxShadow = "0 0 28px hsl(142 76% 48% / 0.8)";
              (e.target as HTMLElement).style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.boxShadow = "0 0 20px hsl(142 76% 48% / 0.5)";
              (e.target as HTMLElement).style.transform = "scale(1)";
            }}
          >
            PRESS START
          </button>
          <p className="text-muted-foreground text-xs font-mono">or press Enter / Space</p>
        </>
      )}

      {status === "paused" && (
        <>
          <div className="text-2xl font-mono font-bold text-[hsl(217_91%_72%)] drop-shadow-[0_0_12px_hsl(217_91%_60%/0.6)]">
            PAUSED
          </div>
          <button
            onClick={onPause}
            className="px-6 py-2 rounded-lg font-mono font-bold text-sm tracking-widest uppercase"
            style={{
              background: "hsl(217 91% 60%)",
              color: "hsl(222 47% 8%)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 16px hsl(217 91% 60% / 0.5)",
            }}
          >
            RESUME
          </button>
          <p className="text-muted-foreground text-xs font-mono">or press Space</p>
        </>
      )}

      {status === "gameover" && (
        <>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold text-[hsl(0_84%_65%)] drop-shadow-[0_0_12px_hsl(0_84%_60%/0.7)]">
              GAME OVER
            </div>
            {isNewBest && (
              <div className="text-xs font-mono font-bold tracking-widest text-yellow-400 mt-1 animate-bounce">
                NEW BEST!
              </div>
            )}
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground font-mono">SCORE</div>
            <div className="text-3xl font-mono font-black text-foreground tabular-nums">
              {score.toString().padStart(4, "0")}
            </div>
          </div>
          <button
            onClick={onStart}
            className="px-8 py-3 rounded-lg font-mono font-bold text-sm tracking-widest uppercase"
            style={{
              background: "hsl(142 76% 48%)",
              color: "hsl(222 47% 8%)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 20px hsl(142 76% 48% / 0.5)",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.boxShadow = "0 0 28px hsl(142 76% 48% / 0.8)";
              (e.target as HTMLElement).style.transform = "scale(1.03)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.boxShadow = "0 0 20px hsl(142 76% 48% / 0.5)";
              (e.target as HTMLElement).style.transform = "scale(1)";
            }}
          >
            PLAY AGAIN
          </button>
        </>
      )}
    </div>
  );
}
