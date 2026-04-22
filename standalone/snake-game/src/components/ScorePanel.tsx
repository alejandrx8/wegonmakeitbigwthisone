interface Props {
  score: number;
  highScore: number;
  level: number;
}

export default function ScorePanel({ score, highScore, level }: Props) {
  return (
    <div className="flex gap-3 w-full justify-center">
      <StatBox label="SCORE" value={score} primary />
      <StatBox label="BEST" value={highScore} />
      <StatBox label="LEVEL" value={level} accent />
    </div>
  );
}

function StatBox({ label, value, primary, accent }: { label: string; value: number; primary?: boolean; accent?: boolean }) {
  const color = primary
    ? "text-primary"
    : accent
    ? "text-[hsl(280_87%_72%)]"
    : "text-muted-foreground";
  const glow = primary
    ? "drop-shadow-[0_0_6px_hsl(142_76%_48%/0.5)]"
    : accent
    ? "drop-shadow-[0_0_6px_hsl(280_87%_65%/0.5)]"
    : "";

  return (
    <div className="flex flex-col items-center bg-card border border-border rounded-lg px-5 py-2 min-w-[90px]">
      <span className="text-[10px] font-mono font-semibold text-muted-foreground tracking-widest">
        {label}
      </span>
      <span className={`text-xl font-mono font-bold tabular-nums ${color} ${glow}`}>
        {value.toString().padStart(4, "0")}
      </span>
    </div>
  );
}
