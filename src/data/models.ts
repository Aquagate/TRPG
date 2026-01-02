export type TruthRank = "Rumor" | "Testimony" | "Record" | "Canon";

export type ThreadStatus = "open" | "in_progress" | "closed";

export type RiftStatus = "open" | "sealed";

export type SpeakerRole = "hero" | "warrior" | "mage" | "priest" | "hostess";

export type SessionLengthLevel = 1 | 2 | 3 | 4 | 5;

export interface MetaState {
  worldId: string;
  darkness: number;
  hostessCharges: {
    promote: number;
    hold: number;
    seal: number;
  };
  updatedAt: number;
}

export interface Character {
  id: SpeakerRole;
  name: string;
  traits: string[];
  secrets: string[];
  powers?: string[];
  updatedAt: number;
}

export interface Thread {
  id: string;
  title: string;
  status: ThreadStatus;
  progress: number;
  notes: string[];
  updatedAt: number;
}

export interface Fact {
  id: string;
  text: string;
  rank: TruthRank;
  sources: string[];
  updatedAt: number;
}

export interface Rift {
  id: string;
  description: string;
  relatedFactIds: string[];
  status: RiftStatus;
  darknessCost: number;
  updatedAt: number;
}

export interface Entity {
  id: string;
  name: string;
  type: "place" | "person" | "faction" | "artifact" | "concept";
  truthRank: TruthRank;
  updatedAt: number;
}

export interface QuestScene {
  id: string;
  type: "explore" | "combat" | "social" | "choice" | "ritual";
  text: string;
  check?: {
    ability: string;
    skillBonus: number;
    dc: number;
  };
  onSuccess?: string;
  onFail?: string;
  options?: Array<{
    label: string;
    nextSceneId?: string;
    check?: {
      ability: string;
      skillBonus: number;
      dc: number;
    };
  }>;
}

export interface Quest {
  id: string;
  title: string;
  summary: string;
  truthRank: TruthRank;
  triggers: string[];
  relatedThreadIds: string[];
  scenes: QuestScene[];
  status: "available" | "accepted" | "completed";
  updatedAt: number;
}

export interface ConversationEntry {
  id: string;
  speakerId: SpeakerRole;
  text: string;
  createdAt: number;
}

export interface SessionLog {
  id: string;
  lengthLevel: SessionLengthLevel;
  startedAt: number;
  conversation: ConversationEntry[];
  questIds: string[];
  checkLogs: Array<{
    id: string;
    questId: string;
    sceneId: string;
    total: number;
    detail: string;
    outcome: "success" | "fail" | "critical" | "fumble";
    createdAt: number;
  }>;
  updatedAt: number;
}

export interface TavernCore {
  schemaVersion: number;
  meta: MetaState;
  characters: Character[];
  threads: Thread[];
  facts: Fact[];
  rifts: Rift[];
  entities: Entity[];
  quests: Quest[];
  sessions: SessionLog[];
}
