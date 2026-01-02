import { v4 as uuid } from "uuid";
import { Fact, Quest, Rift, TavernCore } from "../data/models";

const CONTRADICTION_PATTERNS: Array<[string, string]> = [
  ["真っ暗", "明るい"],
  ["何もない", "賑わい"],
  ["5人しかいない", "他の客"],
];

export const detectContradictions = (
  quest: Quest,
  facts: Fact[],
  core: TavernCore
): string[] => {
  const riftIds: string[] = [];
  const canonFacts = facts.filter((fact) => fact.rank === "Canon");

  canonFacts.forEach((fact) => {
    CONTRADICTION_PATTERNS.forEach(([a, b]) => {
      if (fact.text.includes(a) && quest.summary.includes(b)) {
        const rift: Rift = {
          id: uuid(),
          description: `Canon「${a}」と「${b}」が衝突`,
          relatedFactIds: [fact.id],
          status: "open",
          darknessCost: 1,
          updatedAt: Date.now(),
        };
        core.rifts.push(rift);
        core.meta.darkness += rift.darknessCost;
        riftIds.push(rift.id);
      }
    });
  });

  return riftIds;
};
