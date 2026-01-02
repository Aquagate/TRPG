import { Fact, Rift } from "../models/types";

export const detectCanonContradictions = (facts: Fact[]): Rift[] => {
  const canonFacts = facts.filter((fact) => fact.rank === "Canon");
  const rifts: Rift[] = [];
  for (let i = 0; i < canonFacts.length; i += 1) {
    for (let j = i + 1; j < canonFacts.length; j += 1) {
      const a = canonFacts[i];
      const b = canonFacts[j];
      if (a.text.includes("ない") && b.text.includes("ある")) {
        rifts.push({
          id: crypto.randomUUID(),
          aFactId: a.id,
          bFactId: b.id,
          status: "open",
          darknessCost: 1,
          notes: ["Canon矛盾検出"],
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }
  return rifts;
};
