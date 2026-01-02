import { ConversationLine, Quest, QuestScene, QuestTrigger, Thread } from "../models/types";

const DEFAULT_DC = 9;

const buildScene = (label: string, ability: string, bonus: number): QuestScene => ({
  id: crypto.randomUUID(),
  title: label,
  description: `${label}に挑む。`,
  dc: DEFAULT_DC + bonus,
  ability,
  skillBonus: bonus,
});

export const buildQuest = (
  triggers: QuestTrigger[],
  threads: Thread[],
  lines: ConversationLine[]
): Quest => {
  const triggerSummary = triggers.map((trigger) => trigger.detail).join("・") || "会話の余白";
  const lastLine = lines.at(-1)?.text ?? "酒場のざわめき";
  const scenes: QuestScene[] = [
    buildScene("兆しの調査", "INT", 1),
    buildScene("誓いの交渉", "CHA", 2),
    buildScene("闇への踏み込み", "WIS", 3),
  ];

  return {
    id: crypto.randomUUID(),
    title: `酒場に落ちた影: ${triggerSummary}`,
    issuer: "不明",
    threadIds: threads.map((thread) => thread.id),
    status: "available",
    summary: `"${lastLine}" から兆しが生まれた。${triggerSummary}を確かめる必要がある。`,
    scenes,
    truthRank: "Rumor",
    updatedAt: new Date().toISOString(),
  };
};
