export function getReadinessScoreColor(score: number): string {
  if (score >= 60) return "hsl(var(--success, 142 76% 36%))";
  if (score >= 40) return "hsl(var(--warning, 38 92% 50%))";
  return "hsl(var(--destructive, 0 84% 60%))";
}

export function getReadinessScoreMessage(score: number): string {
  if (score >= 70) return "You're on a great track!";
  if (score >= 50) return "Good start, some room to grow";
  if (score >= 30) return "Let's strengthen your plan";
  return "Take action to improve your readiness";
}
