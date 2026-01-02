import { Quest } from "../models/types";

interface QuestDropProps {
  quests: Quest[];
  onAccept: (questId: string) => void;
}

export const QuestDrop = ({ quests, onAccept }: QuestDropProps) => {
  return (
    <div>
      <h2>クエスト降下</h2>
      {quests.length === 0 ? (
        <p>会話からまだクエストは発行されていない。</p>
      ) : (
        <ul className="card-list">
          {quests.map((quest) => (
            <li key={quest.id} className="card">
              <div className="card-header">
                <h3>{quest.title}</h3>
                <span className={`tag status-${quest.status}`}>{quest.status}</span>
              </div>
              <p>{quest.summary}</p>
              <p className="muted">真実ランク: {quest.truthRank}</p>
              {quest.status === "available" && (
                <button onClick={() => onAccept(quest.id)}>受注する</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
