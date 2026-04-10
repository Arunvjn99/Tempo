import { useEffect, useRef, useState } from "react";

const CIRCUMFERENCE = 2 * Math.PI * 70;

export function ReadinessAnimatedScoreRing({
  value,
  strokeColor,
}: {
  value: number;
  strokeColor: string;
}) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const diff = value - start;
    const duration = 1000;
    const startTime = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(start + diff * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    prevRef.current = value;
  }, [value]);

  const offset = CIRCUMFERENCE - (display / 100) * CIRCUMFERENCE;

  return (
    <div className="relative h-48 w-48">
      <svg className="h-48 w-48 -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="70" fill="none" strokeWidth="10" className="stroke-border" />
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          stroke={strokeColor}
          style={{ transition: "stroke-dashoffset 0.05s linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[2.8rem] font-bold tabular-nums text-foreground">{display}</span>
        <span className="text-[0.75rem] text-muted-foreground">out of 100</span>
      </div>
    </div>
  );
}
