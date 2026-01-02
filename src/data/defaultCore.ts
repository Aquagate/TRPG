import { TavernCore } from "./models";

export const defaultCore: TavernCore = {
  schemaVersion: 1,
  meta: {
    worldId: "world-001",
    darkness: 0,
    hostessCharges: {
      promote: 2,
      hold: 2,
      seal: 1,
    },
    updatedAt: Date.now(),
  },
  characters: [
    {
      id: "hero",
      name: "勇者",
      traits: ["決断が早い"],
      secrets: [],
      updatedAt: Date.now(),
    },
    {
      id: "warrior",
      name: "戦士",
      traits: ["寡黙", "頑健"],
      secrets: [],
      updatedAt: Date.now(),
    },
    {
      id: "mage",
      name: "魔術士",
      traits: ["好奇心", "記録魔"],
      secrets: [],
      updatedAt: Date.now(),
    },
    {
      id: "priest",
      name: "僧侶",
      traits: ["慈愛", "慎重"],
      secrets: [],
      updatedAt: Date.now(),
    },
    {
      id: "hostess",
      name: "女店主",
      traits: ["観測者", "編集者"],
      secrets: ["裂け目を知る"],
      powers: ["promoteTruth", "hold", "sealRift"],
      updatedAt: Date.now(),
    },
  ],
  threads: [
    {
      id: "thread-emitter",
      title: "クエスト発行者は誰か",
      status: "open",
      progress: 0,
      notes: ["正体不明。会話の影から発行される"],
      updatedAt: Date.now(),
    },
    {
      id: "thread-outside",
      title: "外の闇の正体",
      status: "open",
      progress: 0,
      notes: ["外は真っ暗で何もない"],
      updatedAt: Date.now(),
    },
  ],
  facts: [
    {
      id: "fact-outside-dark",
      text: "酒場の外は真っ暗で何も見えない",
      rank: "Canon",
      sources: ["initial"],
      updatedAt: Date.now(),
    },
    {
      id: "fact-only-five",
      text: "酒場には冒険者4人と女店主しかいない",
      rank: "Canon",
      sources: ["initial"],
      updatedAt: Date.now(),
    },
  ],
  rifts: [],
  entities: [],
  quests: [],
  sessions: [],
};
