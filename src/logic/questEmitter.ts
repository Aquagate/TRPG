import { v4 as uuid } from "uuid";
import {
  Fact,
  Quest,
  QuestScene,
  SpeakerRole,
  TavernCore,
  Thread,
  TruthRank,
} from "../data/models";
import { detectContradictions } from "./riftLogic";

const EMOTION_KEYWORDS = ["恐れ", "欲望", "後悔", "誓い", "怒り", "悲しみ", "喜び"];
const TRADE_KEYWORDS = ["取引", "代償", "報酬", "条件", "約束", "契約"];
const SILENCE_MARKERS = ["…", "……", "沈黙", "言えない", "黙"];
const CONTRADICTION_MARKERS = ["でも", "しかし", "実は", "矛盾", "違う"];
const SPEAKER_LABEL: Record<SpeakerRole, string> = {
  hero: "勇者",
  warrior: "戦士",
  mage: "魔術士",
  priest: "僧侶",
  hostess: "女店主",
};

export interface TriggerDetectionResult {
  triggers: string[];
  newEntities: string[];
  relatedThreadIds: string[];
}

export const detectTriggers = (
  text: string,
  knownEntities: string[],
  threads: Thread[]
): TriggerDetectionResult => {
  const triggers: string[] = [];
  const newEntities: string[] = [];

  if (EMOTION_KEYWORDS.some((keyword) => text.includes(keyword))) {
    triggers.push("強い感情");
  }

  if (TRADE_KEYWORDS.some((keyword) => text.includes(keyword))) {
    triggers.push("取引");
  }

  if (SILENCE_MARKERS.some((keyword) => text.includes(keyword))) {
    triggers.push("沈黙");
  }

  if (CONTRADICTION_MARKERS.some((keyword) => text.includes(keyword))) {
    triggers.push("矛盾の芽");
  }

  const tokens = text
    .split(/[\s、。！？「」『』()]/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 2);

  tokens.forEach((token) => {
    if (!knownEntities.includes(token) && !EMOTION_KEYWORDS.includes(token)) {
      newEntities.push(token);
    }
  });

  if (newEntities.length > 0) {
    triggers.push("未知名詞");
  }

  const relatedThreadIds = threads
    .filter((thread) =>
      triggers.some((trigger) => thread.title.includes(trigger) || thread.notes.join("").includes(trigger))
    )
    .map((thread) => thread.id);

  return {
    triggers,
    newEntities: Array.from(new Set(newEntities)),
    relatedThreadIds,
  };
};

export interface QuestGenerationResult {
  quest: Quest;
  newFacts: Fact[];
  riftIds: string[];
  newEntities: string[];
}

export const generateQuest = (
  speaker: SpeakerRole,
  text: string,
  core: TavernCore
): QuestGenerationResult => {
  const knownEntities = core.entities.map((entity) => entity.name);
  const detection = detectTriggers(text, knownEntities, core.threads);
  const triggers = detection.triggers.length > 0 ? detection.triggers : ["会話の影"];
  const relatedThreadIds = detection.relatedThreadIds.length > 0 ? detection.relatedThreadIds : [core.threads[0]?.id].filter(Boolean);

  const sceneTemplates: QuestScene[] = [
    {
      id: uuid(),
      type: "explore",
      text: "暗闇の外縁に踏み出し、概念領域の気配を探る。",
      check: { ability: "WIS", skillBonus: 1, dc: 9 },
      onSuccess: "概念の手触りを掴み、次の場面が現れる。",
      onFail: "闇の圧が強まり、裂け目の兆候を感じる。",
    },
    {
      id: uuid(),
      type: "social",
      text: "手がかりとなる存在と対話し、条件を探る。",
      check: { ability: "CHA", skillBonus: 0, dc: 10 },
      onSuccess: "取引条件を引き出す。",
      onFail: "条件が曖昧になり、追加の検証が必要になる。",
    },
    {
      id: uuid(),
      type: "ritual",
      text: "店主の導きで真実ランクの昇格儀式を試みる。",
      check: { ability: "INT", skillBonus: 0, dc: 11 },
      onSuccess: "真実が一段深く刻まれる。",
      onFail: "儀式は失敗し、噂として残る。",
    },
  ];

  const quest: Quest = {
    id: uuid(),
    title: `${SPEAKER_LABEL[speaker]}の言葉から降る影`,
    summary: `会話に現れた「${text.slice(0, 24)}」の余韻を追う。`,
    truthRank: "Rumor",
    triggers,
    relatedThreadIds,
    scenes: sceneTemplates,
    status: "available",
    updatedAt: Date.now(),
  };

  const newFacts: Fact[] = triggers.map((trigger) => ({
    id: uuid(),
    text: `${trigger}が会話に現れた`,
    rank: "Rumor" as TruthRank,
    sources: [quest.id],
    updatedAt: Date.now(),
  }));

  const riftIds = detectContradictions(quest, core.facts, core);

  return { quest, newFacts, riftIds, newEntities: detection.newEntities };
};
