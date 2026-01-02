import React, { useState } from "react";
import { ConversationEntry, SpeakerRole } from "../data/models";

interface TavernViewProps {
  conversation: ConversationEntry[];
  onAddEntry: (speakerId: SpeakerRole, text: string) => void;
}

const speakers: Array<{ id: SpeakerRole; label: string }> = [
  { id: "hero", label: "勇者" },
  { id: "warrior", label: "戦士" },
  { id: "mage", label: "魔術士" },
  { id: "priest", label: "僧侶" },
  { id: "hostess", label: "女店主" },
];

export const TavernView: React.FC<TavernViewProps> = ({ conversation, onAddEntry }) => {
  const [speakerId, setSpeakerId] = useState<SpeakerRole>("hero");
  const [text, setText] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return;
    onAddEntry(speakerId, text.trim());
    setText("");
  };

  return (
    <section className="panel">
      <h2>酒場の会話ログ</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          話者
          <select value={speakerId} onChange={(event) => setSpeakerId(event.target.value as SpeakerRole)}>
            {speakers.map((speaker) => (
              <option key={speaker.id} value={speaker.id}>
                {speaker.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          発言
          <input value={text} onChange={(event) => setText(event.target.value)} placeholder="発言を入力" />
        </label>
        <button type="submit">ログ追加 &amp; クエスト抽出</button>
      </form>
      <div className="conversation-log">
        {conversation.length === 0 ? (
          <p className="muted">まだ会話がありません。</p>
        ) : (
          conversation.map((entry) => (
            <div key={entry.id} className="log-entry">
              <strong>{speakers.find((speaker) => speaker.id === entry.speakerId)?.label}</strong>
              <span>{new Date(entry.createdAt).toLocaleTimeString()}</span>
              <p>{entry.text}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
