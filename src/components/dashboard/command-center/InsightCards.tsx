import { InsightCard, type InsightCardProps } from "./InsightCard";

export interface InsightCardsProps {
  cards: InsightCardProps[];
}

/** Priority actions row — two insight cards (Figma stitch). */
export function InsightCards({ cards }: InsightCardsProps) {
  return (
    <section className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
      {cards.map((card) => (
        <InsightCard key={card.title} {...card} />
      ))}
    </section>
  );
}
