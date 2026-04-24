import { useState } from "react";
import { Direction, GameStatus } from "@/game/types";

interface Props {
  onDirection: (dir: Direction) => void;
  status: GameStatus;
  onStart: () => void;
  onPause: () => void;
}

const BTN_SIZE = 64;

function DPadButton({
  label,
  dir,
  onDirection,
}: {
  label: React.ReactNode;
  dir: Direction;
  onDirection: (d: Direction) => void;
}) {
  const [pressed, setPressed] = useState(false);

  const release = () => setPressed(false);

  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        setPressed(true);
        onDirection(dir);
      }}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      style={{
        width: BTN_SIZE,
        height: BTN_SIZE,
        background: pressed ? "hsl(142 60% 30%)" : "hsl(222 40% 16%)",
        border: pressed
          ? "1px solid hsl(142 76% 55%)"
          : "1px solid hsl(222 40% 24%)",
        borderRadius: 12,
        color: pressed ? "hsl(142 90% 85%)" : "hsl(215 20% 75%)",
        fontSize: 26,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "manipulation",
        transform: pressed ? "scale(0.9)" : "scale(1)",
        boxShadow: pressed
          ? "0 0 14px 2px hsl(142 76% 48% / 0.6), inset 0 0 8px hsl(142 76% 30% / 0.6)"
          : "0 2px 0 hsl(222 40% 8%)",
        transition:
          "transform 0.08s ease-out, background 0.12s, color 0.12s, box-shadow 0.12s, border-color 0.12s",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {label}
    </button>
  );
}

function ActionButton({
  status,
  onStart,
  onPause,
}: {
  status: GameStatus;
  onStart: () => void;
  onPause: () => void;
}) {
  const [pressed, setPressed] = useState(false);
  const release = () => setPressed(false);

  return (
    <button
      onPointerDown={(e) => {
        e.preventDefault();
        setPressed(true);
        if (status === "idle" || status === "gameover" || status === "won") onStart();
        else onPause();
      }}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
      style={{
        padding: "10px 32px",
        background: pressed ? "hsl(217 80% 35%)" : "hsl(222 40% 18%)",
        border: pressed
          ? "1px solid hsl(217 91% 60%)"
          : "1px solid hsl(222 40% 26%)",
        borderRadius: 10,
        color: pressed ? "hsl(217 91% 90%)" : "hsl(215 20% 70%)",
        fontFamily: "var(--font-mono)",
        fontSize: 12,
        fontWeight: "bold",
        letterSpacing: "0.14em",
        cursor: "pointer",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        marginTop: 4,
        transform: pressed ? "scale(0.94)" : "scale(1)",
        boxShadow: pressed
          ? "0 0 14px 2px hsl(217 91% 60% / 0.55)"
          : "0 2px 0 hsl(222 40% 8%)",
        transition:
          "transform 0.08s ease-out, background 0.12s, color 0.12s, box-shadow 0.12s, border-color 0.12s",
      }}
    >
      {status === "playing" ? "PAUSE" : status === "paused" ? "RESUME" : "START"}
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

      <ActionButton status={status} onStart={onStart} onPause={onPause} />
    </div>
  );
}
