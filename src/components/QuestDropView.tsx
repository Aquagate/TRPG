import React from "react";
import { Quest, Thread } from "../data/models";

interface QuestDropViewProps {
  quests: Quest[];
  threads: Thread[];
  onAccept: (questId: string) => void;
}

export const QuestDropView: React.FC<QuestDropViewProps> = ({ quests, threads, onAccept }) => {
  const availableQuests = quests.filter((quest) => quest.status === "available");

  return (
    <section className="panel">
      <h2>Quest Drop</h2>
      {availableQuests.length === 0 ? (
        <p className="muted">まだクエストが発行されていません。</p>
      ) : (
        <div className="quest-grid">
          {availableQuests.map((quest) => (
            <article key={quest.id} className="quest-card">
              <header>
                <h3>{quest.title}</h3>
                <span className={`badge rank-${quest.truthRank.toLowerCase()}`}>{quest.truthRank}</span>
              </header>
              <p>{quest.summary}</p>
              <div className="tag-row">
                {quest.triggers.map((trigger) => (
                  <span key={trigger} className="tag">
                    {trigger}
                  </span>
                ))}
              </div>
              <div className="muted small">
                関連スレッド: {quest.relatedThreadIds.map((id) => threads.find((thread) => thread.id === id)?.title ?? id).join(" / ")}
              </div>
              <button type="button" onClick={() => onAccept(quest.id)}>
                受注する
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
