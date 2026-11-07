const RANKS: { min: number; title: string }[] = [
  { min: 0, title: "Vagrant" },
  { min: 50, title: "Novice Adventurer" },
  { min: 150, title: "Adventurer" },
  { min: 350, title: "Seasoned Adventurer" },
  { min: 600, title: "Veteran Adventurer" },
  { min: 1000, title: "Master Adventurer" },
  { min: 1800, title: "Legend of the Deep" },
];

export function getRank(score: number): string {
  let title = RANKS[0].title;
  for (const rank of RANKS) {
    if (score >= rank.min) title = rank.title;
  }
  return title;
}

export function nextRankThreshold(score: number): number | null {
  const next = RANKS.find((r) => r.min > score);
  return next ? next.min : null;
}
