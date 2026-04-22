import { GameState, GRID_SIZE, CELL_SIZE, Position } from "@/game/types";

interface FloatingScore {
  id: number;
  x: number;
  y: number;
  value: number;
}

interface Props {
  gameState: GameState;
  floatingScores: FloatingScore[];
}

function cellStyle(x: number, y: number): React.CSSProperties {
  return {
    position: "absolute",
    left: x * CELL_SIZE,
    top: y * CELL_SIZE,
    width: CELL_SIZE,
    height: CELL_SIZE,
  };
}

function SnakeSegment({ pos, index, total, direction }: { pos: Position; index: number; total: number; direction: string }) {
  const isHead = index === 0;
  const isTail = index === total - 1;

  const brightness = isHead ? 1 : 0.65 + (0.35 * (1 - index / total));
  const green = Math.round(170 + brightness * 40);

  let borderRadius = "4px";
  if (isHead) {
    if (direction === "RIGHT") borderRadius = "4px 10px 10px 4px";
    else if (direction === "LEFT") borderRadius = "10px 4px 4px 10px";
    else if (direction === "UP") borderRadius = "10px 10px 4px 4px";
    else borderRadius = "4px 4px 10px 10px";
  } else if (isTail) {
    borderRadius = "3px";
  }

  return (
    <div
      style={{
        ...cellStyle(pos.x, pos.y),
        backgroundColor: isHead
          ? `rgb(30, ${green}, 80)`
          : `rgb(20, ${Math.round(brightness * 180)}, 60)`,
        borderRadius,
        border: isHead ? "1px solid rgba(100,255,130,0.5)" : "1px solid rgba(60,200,80,0.2)",
        boxShadow: isHead
          ? "0 0 8px 2px rgba(50,220,90,0.4)"
          : undefined,
        transition: "background-color 0.05s",
        zIndex: isHead ? 2 : 1,
      }}
    />
  );
}

function FoodCell({ pos }: { pos: Position }) {
  return (
    <div
      style={{
        ...cellStyle(pos.x, pos.y),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: CELL_SIZE - 6,
          height: CELL_SIZE - 6,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #ff8080, #e02020)",
          boxShadow: "0 0 8px 3px rgba(220,60,60,0.6)",
          animation: "pulse-red 1.5s ease-in-out infinite",
        }}
      />
    </div>
  );
}

export default function GameBoard({ gameState, floatingScores }: Props) {
  const boardPx = GRID_SIZE * CELL_SIZE;
  const { snake, food, direction } = gameState;

  return (
    <div
      style={{
        position: "relative",
        width: boardPx,
        height: boardPx,
        background: "hsl(222 47% 6%)",
        border: "2px solid hsl(222 40% 20%)",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 0 30px rgba(0,0,0,0.6), inset 0 0 40px rgba(0,0,0,0.3)",
      }}
    >
      {/* Grid lines */}
      <svg
        style={{ position: "absolute", inset: 0, opacity: 0.04, pointerEvents: "none" }}
        width={boardPx}
        height={boardPx}
      >
        {Array.from({ length: GRID_SIZE + 1 }).map((_, i) => (
          <g key={i}>
            <line x1={i * CELL_SIZE} y1={0} x2={i * CELL_SIZE} y2={boardPx} stroke="white" strokeWidth="1" />
            <line x1={0} y1={i * CELL_SIZE} x2={boardPx} y2={i * CELL_SIZE} stroke="white" strokeWidth="1" />
          </g>
        ))}
      </svg>

      {/* Food */}
      <FoodCell pos={food} />

      {/* Snake */}
      {snake.map((pos, i) => (
        <SnakeSegment
          key={`${i}-${pos.x}-${pos.y}`}
          pos={pos}
          index={i}
          total={snake.length}
          direction={direction}
        />
      ))}

      {/* Floating score indicators */}
      {floatingScores.map((fs) => (
        <div
          key={fs.id}
          className="float-score"
          style={{
            position: "absolute",
            left: fs.x * CELL_SIZE + CELL_SIZE / 2,
            top: fs.y * CELL_SIZE,
            transform: "translateX(-50%)",
            color: "hsl(142 76% 60%)",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            fontWeight: "bold",
            pointerEvents: "none",
            zIndex: 10,
            textShadow: "0 0 6px rgba(80,255,120,0.8)",
          }}
        >
          +{fs.value}
        </div>
      ))}
    </div>
  );
}
