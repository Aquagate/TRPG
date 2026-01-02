import React, { useMemo, useState } from "react";
import { Quest, SessionLog } from "../data/models";

interface QuestRunnerViewProps {
  activeQuest: Quest | null;
  session: SessionLog | null;
  onLogCheck: (questId: string, sceneId: string, total: number, detail: string, outcome: SessionLog["checkLogs"][number]["outcome"]) => void;
  onCompleteQuest: (questId: string) => void;
}

const roll2d6 = (): number => Math.floor(Math.random() * 6 + 1) + Math.floor(Math.random() * 6 + 1);

export const QuestRunnerView: React.FC<QuestRunnerViewProps> = ({ activeQuest, session, onLogCheck, onCompleteQuest }) => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [abilityBonus, setAbilityBonus] = useState(0);

  const scene = useMemo(() => {
    if (!activeQuest) return null;
    return activeQuest.scenes[sceneIndex] ?? null;
  }, [activeQuest, sceneIndex]);

  if (!activeQuest) {
    return (
      <section className="panel">
        <h2>Quest Runner</h2>
        <p className="muted">受注済みクエストがありません。</p>
      </section>
    );
  }

  const handleCheck = () => {
    if (!scene?.check) return;
    const dice = roll2d6();
    const total = dice + scene.check.skillBonus + abilityBonus;
    const outcomeBase = total >= scene.check.dc ? "success" : "fail";
    const outcome = dice === 12 ? "critical" : dice === 2 ? "fumble" : outcomeBase;
    const detail = `2D6(${dice}) + Ability(${abilityBonus}) + Bonus(${scene.check.skillBonus}) vs DC ${scene.check.dc}`;
    onLogCheck(activeQuest.id, scene.id, total, detail, outcome);
  };

  const handleNext = () => {
    if (!activeQuest) return;
    if (sceneIndex < activeQuest.scenes.length - 1) {
      setSceneIndex((prev) => prev + 1);
    } else {
      onCompleteQuest(activeQuest.id);
    }
  };

  return (
    <section className="panel">
      <h2>Quest Runner</h2>
      <h3>{activeQuest.title}</h3>
      <p>{activeQuest.summary}</p>
      {scene ? (
        <div className="scene-card">
          <p className="scene-type">{scene.type.toUpperCase()}</p>
          <p>{scene.text}</p>
          {scene.check && (
            <div className="check-box">
              <p>
                判定: {scene.check.ability} + Bonus {scene.check.skillBonus} / DC {scene.check.dc}
              </p>
              <label>
                Ability Bonus
                <input
                  type="number"
                  value={abilityBonus}
                  onChange={(event) => setAbilityBonus(Number(event.target.value))}
                />
              </label>
              <button type="button" onClick={handleCheck}>
                2D6 判定
              </button>
            </div>
          )}
          <button type="button" onClick={handleNext}>
            {sceneIndex < activeQuest.scenes.length - 1 ? "次のシーンへ" : "クエスト完了"}
          </button>
        </div>
      ) : (
        <p className="muted">シーン情報がありません。</p>
      )}

      <div className="log-panel">
        <h4>判定ログ</h4>
        {session?.checkLogs.filter((log) => log.questId === activeQuest.id).length ? (
          session?.checkLogs
            .filter((log) => log.questId === activeQuest.id)
            .map((log) => (
              <div key={log.id} className="log-entry">
                <strong>{log.outcome.toUpperCase()}</strong>
                <span>{log.detail}</span>
                <span>{new Date(log.createdAt).toLocaleTimeString()}</span>
              </div>
            ))
        ) : (
          <p className="muted">判定ログはまだありません。</p>
        )}
      </div>
    </section>
  );
};
