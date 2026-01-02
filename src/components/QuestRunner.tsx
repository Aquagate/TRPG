import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Quest, QuestScene, SessionLogEntry } from "../models/types";

interface QuestRunnerProps {
  quests: Quest[];
  onUpdateQuest: (quest: Quest) => void;
  onLog: Dispatch<SetStateAction<SessionLogEntry[]>>;
}

const roll2d6 = () => Math.ceil(Math.random() * 6) + Math.ceil(Math.random() * 6);

export const QuestRunner = ({ quests, onUpdateQuest, onLog }: QuestRunnerProps) => {
  const [activeQuestId, setActiveQuestId] = useState<string>("");
  const [sceneIndex, setSceneIndex] = useState(0);

  const activeQuest = useMemo(
    () => quests.find((quest) => quest.id === activeQuestId && quest.status === "accepted"),
    [activeQuestId, quests]
  );

  const currentScene: QuestScene | undefined = activeQuest?.scenes[sceneIndex];

  const handleRoll = () => {
    if (!activeQuest || !currentScene) return;
    const roll = roll2d6();
    const total = roll + currentScene.skillBonus;
    const success = total >= currentScene.dc;
    const critical = roll === 12;
    const fumble = roll === 2;

    const logMessage = [
      `${currentScene.title} 判定: 2d6=${roll} + ${currentScene.skillBonus} (合計${total})`,
      success ? "成功" : "失敗",
      critical ? "クリティカル" : "",
      fumble ? "ファンブル" : "",
    ]
      .filter(Boolean)
      .join(" / ");

    onLog((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "roll",
        message: logMessage,
        createdAt: new Date().toISOString(),
      },
    ]);

    if (sceneIndex < activeQuest.scenes.length - 1) {
      setSceneIndex(sceneIndex + 1);
    } else {
      const updatedQuest: Quest = {
        ...activeQuest,
        status: success ? "completed" : "failed",
        updatedAt: new Date().toISOString(),
      };
      onUpdateQuest(updatedQuest);
      setSceneIndex(0);
    }
  };

  return (
    <div>
      <h2>クエスト進行</h2>
      <label>
        進行中のクエスト
        <select value={activeQuestId} onChange={(event) => setActiveQuestId(event.target.value)}>
          <option value="">選択なし</option>
          {quests
            .filter((quest) => quest.status === "accepted")
            .map((quest) => (
              <option key={quest.id} value={quest.id}>
                {quest.title}
              </option>
            ))}
        </select>
      </label>
      {activeQuest && currentScene ? (
        <div className="card">
          <h3>{currentScene.title}</h3>
          <p>{currentScene.description}</p>
          <p>
            判定: 2D6 + {currentScene.ability} + {currentScene.skillBonus} ≥ {currentScene.dc}
          </p>
          <button onClick={handleRoll}>判定する</button>
          <p className="muted">
            シーン {sceneIndex + 1} / {activeQuest.scenes.length}
          </p>
        </div>
      ) : (
        <p>受注済みクエストを選択してください。</p>
      )}
    </div>
  );
};
