import { FormEvent, useState } from "react";
import { Character, ConversationLine } from "../models/types";

interface TavernProps {
  characters: Character[];
  conversation: ConversationLine[];
  charactersById: Map<string, Character>;
  onSubmit: (speakerId: string, text: string) => void;
}

export const Tavern = ({ characters, conversation, charactersById, onSubmit }: TavernProps) => {
  const [speakerId, setSpeakerId] = useState(characters[0]?.id ?? "");
  const [text, setText] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!text.trim() || !speakerId) {
      return;
    }
    onSubmit(speakerId, text.trim());
    setText("");
  };

  return (
    <div>
      <h2>酒場の会話</h2>
      <form onSubmit={handleSubmit} className="stack">
        <label>
          話者
          <select value={speakerId} onChange={(event) => setSpeakerId(event.target.value)}>
            {characters.map((character) => (
              <option key={character.id} value={character.id}>
                {character.name} ({character.role})
              </option>
            ))}
          </select>
        </label>
        <label>
          発言
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="未知の名詞、誓い、沈黙……"
            rows={3}
          />
        </label>
        <button type="submit">会話を刻む</button>
      </form>
      <div className="log">
        {conversation.length === 0 ? (
          <p>まだ会話はない。</p>
        ) : (
          conversation.map((line) => {
            const speaker = charactersById.get(line.speakerId);
            return (
              <div key={line.id} className="log-line">
                <strong>{speaker?.name ?? "不明"}:</strong> {line.text}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
