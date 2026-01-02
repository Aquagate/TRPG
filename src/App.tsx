import React, { useEffect, useMemo, useState } from "react";
import { v4 as uuid } from "uuid";
import { TabNav, TabKey } from "./components/TabNav";
import { TavernView } from "./components/TavernView";
import { QuestDropView } from "./components/QuestDropView";
import { QuestRunnerView } from "./components/QuestRunnerView";
import { WorldLedgerView } from "./components/WorldLedgerView";
import { HostessConsoleView } from "./components/HostessConsoleView";
import { defaultCore } from "./data/defaultCore";
import {
  ConversationEntry,
  Quest,
  SessionLog,
  SpeakerRole,
  TavernCore,
  TruthRank,
} from "./data/models";
import { generateQuest } from "./logic/questEmitter";
import { IndexedDbStorage } from "./storage/indexedDbStorage";
import "./styles.css";

const storage = new IndexedDbStorage();

const ensureSession = (core: TavernCore): SessionLog => {
  const existing = core.sessions[0];
  if (existing) return existing;
  const session: SessionLog = {
    id: uuid(),
    lengthLevel: 1,
    startedAt: Date.now(),
    conversation: [],
    questIds: [],
    checkLogs: [],
    updatedAt: Date.now(),
  };
  core.sessions.push(session);
  return session;
};

export const App: React.FC = () => {
  const [core, setCore] = useState<TavernCore>(defaultCore);
  const [activeTab, setActiveTab] = useState<TabKey>("tavern");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const stored = await storage.getCore();
      if (stored) {
        setCore(stored);
      }
      setLoading(false);
    };
    void load();
  }, []);

  useEffect(() => {
    if (!loading) {
      void storage.saveCore(core);
    }
  }, [core, loading]);

  const session = useMemo(() => ensureSession({ ...core, sessions: [...core.sessions] }), [core]);

  const handleAddEntry = (speakerId: SpeakerRole, text: string) => {
    setCore((prev) => {
      const nextCore: TavernCore = { ...prev, sessions: [...prev.sessions] };
      const nextSession = ensureSession(nextCore);
      const entry: ConversationEntry = {
        id: uuid(),
        speakerId,
        text,
        createdAt: Date.now(),
      };
      nextSession.conversation = [...nextSession.conversation, entry];
      nextSession.updatedAt = Date.now();

      const { quest, newFacts, newEntities } = generateQuest(speakerId, text, nextCore);
      nextCore.quests = [...nextCore.quests, quest];
      nextCore.facts = [...nextCore.facts, ...newFacts];
      nextSession.questIds = Array.from(new Set([...nextSession.questIds, quest.id]));

      if (newEntities.length > 0) {
        const entityAdds = newEntities.map((name) => ({
          id: uuid(),
          name,
          type: "concept" as const,
          truthRank: "Rumor" as const,
          updatedAt: Date.now(),
        }));
        nextCore.entities = [...nextCore.entities, ...entityAdds];
      }

      quest.relatedThreadIds.forEach((threadId) => {
        const thread = nextCore.threads.find((item) => item.id === threadId);
        if (thread) {
          thread.progress += 1;
          thread.status = "in_progress";
          thread.updatedAt = Date.now();
        } else {
          nextCore.threads.push({
            id: threadId,
            title: `新規スレッド ${threadId}`,
            status: "open",
            progress: 1,
            notes: ["会話から新たに派生"],
            updatedAt: Date.now(),
          });
        }
      });

      nextCore.meta.updatedAt = Date.now();
      return { ...nextCore };
    });
  };

  const handleAcceptQuest = (questId: string) => {
    setCore((prev) => {
      const nextQuests = prev.quests.map((quest) =>
        quest.id === questId ? { ...quest, status: "accepted", updatedAt: Date.now() } : quest
      );
      return { ...prev, quests: nextQuests, meta: { ...prev.meta, updatedAt: Date.now() } };
    });
    setActiveTab("quest-runner");
  };

  const handleCompleteQuest = (questId: string) => {
    setCore((prev) => {
      const nextQuests = prev.quests.map((quest) =>
        quest.id === questId ? { ...quest, status: "completed", updatedAt: Date.now() } : quest
      );
      const nextMeta = { ...prev.meta, darkness: Math.max(prev.meta.darkness - 1, 0), updatedAt: Date.now() };
      return { ...prev, quests: nextQuests, meta: nextMeta };
    });
  };

  const handleLogCheck = (
    questId: string,
    sceneId: string,
    total: number,
    detail: string,
    outcome: SessionLog["checkLogs"][number]["outcome"]
  ) => {
    setCore((prev) => {
      const nextCore = { ...prev, sessions: [...prev.sessions] };
      const nextSession = ensureSession(nextCore);
      nextSession.checkLogs = [
        ...nextSession.checkLogs,
        { id: uuid(), questId, sceneId, total, detail, outcome, createdAt: Date.now() },
      ];
      nextSession.updatedAt = Date.now();
      nextCore.meta.updatedAt = Date.now();
      return { ...nextCore };
    });
  };

  const handlePromoteFact = (factId: string, nextRank: TruthRank) => {
    setCore((prev) => {
      if (prev.meta.hostessCharges.promote <= 0) return prev;
      const nextFacts = prev.facts.map((fact) =>
        fact.id === factId ? { ...fact, rank: nextRank, updatedAt: Date.now() } : fact
      );
      return {
        ...prev,
        facts: nextFacts,
        meta: {
          ...prev.meta,
          hostessCharges: { ...prev.meta.hostessCharges, promote: prev.meta.hostessCharges.promote - 1 },
          darkness: prev.meta.darkness + 1,
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleHoldFact = (factId: string) => {
    setCore((prev) => {
      if (prev.meta.hostessCharges.hold <= 0) return prev;
      const nextFacts = prev.facts.map((fact) =>
        fact.id === factId ? { ...fact, updatedAt: Date.now() } : fact
      );
      return {
        ...prev,
        facts: nextFacts,
        meta: {
          ...prev.meta,
          hostessCharges: { ...prev.meta.hostessCharges, hold: prev.meta.hostessCharges.hold - 1 },
          updatedAt: Date.now(),
        },
      };
    });
  };

  const handleSealRift = (riftId: string) => {
    setCore((prev) => {
      if (prev.meta.hostessCharges.seal <= 0) return prev;
      const nextRifts = prev.rifts.map((rift) =>
        rift.id === riftId ? { ...rift, status: "sealed", updatedAt: Date.now() } : rift
      );
      return {
        ...prev,
        rifts: nextRifts,
        meta: {
          ...prev.meta,
          hostessCharges: { ...prev.meta.hostessCharges, seal: prev.meta.hostessCharges.seal - 1 },
          darkness: Math.max(prev.meta.darkness - 1, 0),
          updatedAt: Date.now(),
        },
      };
    });
  };

  const activeQuest: Quest | null = core.quests.find((quest) => quest.status === "accepted") ?? null;

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tavern Core TRPG</h1>
        <p>会話からクエストを降らせ、世界を矛盾なく確定させるMVP。</p>
      </header>
      <TabNav activeTab={activeTab} onChange={setActiveTab} />
      <main className="main">
        {activeTab === "tavern" && (
          <TavernView conversation={session.conversation} onAddEntry={handleAddEntry} />
        )}
        {activeTab === "quest-drop" && (
          <QuestDropView quests={core.quests} threads={core.threads} onAccept={handleAcceptQuest} />
        )}
        {activeTab === "quest-runner" && (
          <QuestRunnerView
            activeQuest={activeQuest}
            session={session}
            onLogCheck={handleLogCheck}
            onCompleteQuest={handleCompleteQuest}
          />
        )}
        {activeTab === "world-ledger" && (
          <WorldLedgerView
            facts={core.facts}
            threads={core.threads}
            rifts={core.rifts}
            darkness={core.meta.darkness}
          />
        )}
        {activeTab === "hostess" && (
          <HostessConsoleView
            facts={core.facts}
            rifts={core.rifts}
            hostessCharges={core.meta.hostessCharges}
            onPromoteFact={handlePromoteFact}
            onHoldFact={handleHoldFact}
            onSealRift={handleSealRift}
          />
        )}
      </main>
    </div>
  );
};
