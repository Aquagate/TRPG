import { useMemo, useState } from "react";
import { Fact, TavernCore, Thread, TruthRank } from "../models/types";

interface HostessConsoleProps {
  core: TavernCore;
  onUpdateFacts: (facts: Fact[]) => void;
  onUpdateThreads: (threads: Thread[]) => void;
  onSealRift: (riftId: string) => void;
}

const rankOrder: TruthRank[] = ["Rumor", "Testimony", "Record", "Canon"];

export const HostessConsole = ({ core, onUpdateFacts, onUpdateThreads, onSealRift }: HostessConsoleProps) => {
  const [factId, setFactId] = useState(core.facts[0]?.id ?? "");
  const [threadId, setThreadId] = useState(core.threads[0]?.id ?? "");
  const [riftId, setRiftId] = useState(core.rifts[0]?.id ?? "");
  const [note, setNote] = useState("");

  const selectedFact = useMemo(() => core.facts.find((fact) => fact.id === factId), [core.facts, factId]);

  const handlePromote = () => {
    if (!selectedFact) return;
    const currentIndex = rankOrder.indexOf(selectedFact.rank);
    const nextRank = rankOrder[Math.min(currentIndex + 1, rankOrder.length - 1)];
    const updatedFacts = core.facts.map((fact) =>
      fact.id === selectedFact.id
        ? { ...fact, rank: nextRank, updatedAt: new Date().toISOString() }
        : fact
    );
    onUpdateFacts(updatedFacts);
  };

  const handleHold = () => {
    if (!selectedFact) return;
    const updatedFacts = core.facts.map((fact) =>
      fact.id === selectedFact.id
        ? {
            ...fact,
            rank: "Rumor",
            sources: [...fact.sources, "hostess-hold"],
            updatedAt: new Date().toISOString(),
          }
        : fact
    );
    onUpdateFacts(updatedFacts);
  };

  const handleAdvanceThread = () => {
    if (!threadId) return;
    const updatedThreads = core.threads.map((thread) =>
      thread.id === threadId
        ? {
            ...thread,
            progress: thread.progress + 1,
            notes: note ? [...thread.notes, note] : thread.notes,
            updatedAt: new Date().toISOString(),
          }
        : thread
    );
    onUpdateThreads(updatedThreads);
    setNote("");
  };

  const handleSealRift = () => {
    if (!riftId) return;
    onSealRift(riftId);
  };

  return (
    <div>
      <h2>女店主コンソール</h2>
      <p>観測者/編集者として真実を昇格・保留し、裂け目を封印する。</p>
      <div className="stack">
        <label>
          対象Fact
          <select value={factId} onChange={(event) => setFactId(event.target.value)}>
            {core.facts.map((fact) => (
              <option key={fact.id} value={fact.id}>
                {fact.text} ({fact.rank})
              </option>
            ))}
          </select>
        </label>
        <div className="row">
          <button type="button" onClick={handlePromote}>
            真実ランク昇格
          </button>
          <button type="button" onClick={handleHold}>
            保留 (Rumor)
          </button>
        </div>
        <label>
          対象Thread
          <select value={threadId} onChange={(event) => setThreadId(event.target.value)}>
            {core.threads.map((thread) => (
              <option key={thread.id} value={thread.id}>
                {thread.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          追加ノート
          <input value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        <button type="button" onClick={handleAdvanceThread}>
          スレッドを前進
        </button>
        <label>
          対象Rift
          <select value={riftId} onChange={(event) => setRiftId(event.target.value)}>
            {core.rifts.map((rift) => (
              <option key={rift.id} value={rift.id}>
                {rift.id.slice(0, 6)}... ({rift.status})
              </option>
            ))}
          </select>
        </label>
        <button type="button" onClick={handleSealRift}>
          裂け目を封印
        </button>
      </div>
    </div>
  );
};
