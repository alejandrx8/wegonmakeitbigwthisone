import { Direction, GameStatus } from "@/game/types";

interface Props {
  onDirection: (dir: Direction) => void;
  status: GameStatus;
  onStart: () => void;
  onPause: () => void;
}

function DPadButton({ label, dir, onDirection }: { label: React.ReactNode; dir: Direction; onDirection: (d: Direction) => void }) {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onDirection(dir);
      }}
      style={{
        width: 52,
        height: 52,
        background: "hsl(222 40% 16%)",
        border: "1px solid hsl(222 40% 24%)",
        borderRadius: 8,
        color: "hsl(215 20% 70%)",
        fontSize: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "manipulation",
        transition: "background 0.1s",
      }}
    >
      {label}
    </button>
  );
}

export default function MobileControls({ onDirection, status, onStart, onPause }: Props) {
  return (
    <div className="flex flex-col items-center gap-3 mt-2">
      {/* D-Pad */}
      <div className="flex flex-col items-center gap-1">
        <DPadButton label="▲" dir="UP" onDirection={onDirection} />
        <div className="flex gap-1">
          <DPadButton label="◀" dir="LEFT" onDirection={onDirection} />
          <div style={{ width: 52, height: 52 }} />
          <DPadButton label="▶" dir="RIGHT" onDirection={onDirection} />
        </div>
        <DPadButton label="▼" dir="DOWN" onDirection={onDirection} />
      </div>

      {/* Action button */}
      <button
        onPointerDown={(e) => {
          e.preventDefault();
          if (status === "idle" || status === "gameover") onStart();
          else onPause();
        }}
        style={{
          padding: "8px 28px",
          background: "hsl(222 40% 18%)",
          border: "1px solid hsl(222 40% 26%)",
          borderRadius: 8,
          color: "hsl(215 20% 65%)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: "bold",
          letterSpacing: "0.12em",
          cursor: "pointer",
          touchAction: "manipulation",
        }}
      >
        {status === "playing" ? "PAUSE" : status === "paused" ? "RESUME" : "START"}
      </button>
    </div>
  );
}
