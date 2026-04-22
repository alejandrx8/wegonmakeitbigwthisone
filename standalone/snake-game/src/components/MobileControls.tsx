import { Direction, GameStatus } from "@/game/types";

interface Props {
  onDirection: (dir: Direction) => void;
  status: GameStatus;
  onStart: () => void;
  onPause: () => void;
}

const BTN_SIZE = 64;

function DPadButton({ label, dir, onDirection }: { label: React.ReactNode; dir: Direction; onDirection: (d: Direction) => void }) {
  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        onDirection(dir);
      }}
      style={{
        width: BTN_SIZE,
        height: BTN_SIZE,
        background: "hsl(222 40% 16%)",
        border: "1px solid hsl(222 40% 24%)",
        borderRadius: 12,
        color: "hsl(215 20% 75%)",
        fontSize: 26,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "manipulation",
        transition: "background 0.1s, transform 0.05s",
        WebkitTapHighlightColor: "transparent",
      }}
      onPointerUp={(e) => (e.currentTarget.style.background = "hsl(222 40% 16%)")}
      onPointerCancel={(e) => (e.currentTarget.style.background = "hsl(222 40% 16%)")}
    >
      {label}
    </button>
  );
}

export default function MobileControls({ onDirection, status, onStart, onPause }: Props) {
  return (
    <div className="flex flex-col items-center gap-2 mt-1">
      {/* D-Pad */}
      <div className="flex flex-col items-center gap-1.5">
        <DPadButton label="▲" dir="UP" onDirection={onDirection} />
        <div className="flex gap-1.5">
          <DPadButton label="◀" dir="LEFT" onDirection={onDirection} />
          <div style={{ width: BTN_SIZE, height: BTN_SIZE }} />
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
          padding: "10px 32px",
          background: "hsl(222 40% 18%)",
          border: "1px solid hsl(222 40% 26%)",
          borderRadius: 10,
          color: "hsl(215 20% 70%)",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: "bold",
          letterSpacing: "0.14em",
          cursor: "pointer",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
          marginTop: 4,
        }}
      >
        {status === "playing" ? "PAUSE" : status === "paused" ? "RESUME" : "START"}
      </button>
    </div>
  );
}
