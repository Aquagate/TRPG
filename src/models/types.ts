export type TruthRank = "Rumor" | "Testimony" | "Record" | "Canon";

export type ThreadStatus = "open" | "progress" | "sealed";
export type RiftStatus = "open" | "sealed";
export type QuestStatus = "available" | "accepted" | "completed" | "failed";

export interface Timestamped {
  id: string;
  updatedAt: string;
}

export interface Character extends Timestamped {
  name: string;
  role: "勇者" | "戦士" | "魔術士" | "僧侶" | "女店主";
  traits: string[];
  secrets: string[];
  abilities: Record<string, number>;
}

export interface Thread extends Timestamped {
  title: string;
  status: ThreadStatus;
  progress: number;
  notes: string[];
}

export interface Fact extends Timestamped {
  text: string;
  rank: TruthRank;
  sources: string[];
}

export interface Rift extends Timestamped {
  aFactId: string;
  bFactId: string;
  status: RiftStatus;
  darknessCost: number;
  notes: string[];
}

export interface Entity extends Timestamped {
  name: string;
  kind: "place" | "faction" | "person" | "object" | "concept";
  description: string;
  truthRank: TruthRank;
}

export interface QuestScene {
  id: string;
  title: string;
  description: string;
  dc: number;
  ability: string;
  skillBonus: number;
}

export interface Quest extends Timestamped {
  title: string;
  issuer: string;
  threadIds: string[];
  status: QuestStatus;
  summary: string;
  scenes: QuestScene[];
  truthRank: TruthRank;
}

export interface SessionLogEntry {
  id: string;
  type: "dialogue" | "roll" | "quest" | "system";
  message: string;
  createdAt: string;
}

export interface Session extends Timestamped {
  level: 1 | 2 | 3 | 4 | 5;
  logs: SessionLogEntry[];
  activeQuestId?: string;
}

export interface TavernCore {
  schemaVersion: number;
  meta: {
    worldId: string;
    darkness: number;
    updatedAt: string;
  };
  characters: Character[];
  threads: Thread[];
  facts: Fact[];
  rifts: Rift[];
  entities: Entity[];
  quests: Quest[];
  sessions: Session[];
}

export interface ConversationLine {
  id: string;
  speakerId: string;
  text: string;
  createdAt: string;
}

export interface QuestTrigger {
  id: string;
  kind: "unknownNoun" | "strongEmotion" | "trade" | "contradictionSeed" | "silence";
  lineId: string;
  detail: string;
}
