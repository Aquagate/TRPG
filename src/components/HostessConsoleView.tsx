import React, { useState } from "react";
import { Fact, Rift, TruthRank } from "../data/models";

interface HostessConsoleViewProps {
  facts: Fact[];
  rifts: Rift[];
  hostessCharges: {
    promote: number;
    hold: number;
    seal: number;
  };
  onPromoteFact: (factId: string, nextRank: TruthRank) => void;
  onHoldFact: (factId: string) => void;
  onSealRift: (riftId: string) => void;
}

const RANK_FLOW: TruthRank[] = ["Rumor", "Testimony", "Record", "Canon"];

export const HostessConsoleView: React.FC<HostessConsoleViewProps> = ({
  facts,
  rifts,
  hostessCharges,
  onPromoteFact,
  onHoldFact,
  onSealRift,
}) => {
  const [selectedFact, setSelectedFact] = useState<string>(facts[0]?.id ?? "");

  const fact = facts.find((item) => item.id === selectedFact);
  const nextRank = fact ? RANK_FLOW[Math.min(RANK_FLOW.indexOf(fact.rank) + 1, RANK_FLOW.length - 1)] : "Rumor";

  return (
    <section className="panel">
      <h2>Hostess Console</h2>
      <p className="muted">昇格/保留/封印は回数制限と代償を伴う。</p>

      <div className="console-grid">
        <div>
          <h3>真実ランクの昇格</h3>
          <p>残り: {hostessCharges.promote}</p>
          <select value={selectedFact} onChange={(event) => setSelectedFact(event.target.value)}>
            {facts.map((factItem) => (
              <option key={factItem.id} value={factItem.id}>
                {factItem.text} ({factItem.rank})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => fact && onPromoteFact(fact.id, nextRank)}
            disabled={hostessCharges.promote <= 0 || !fact || fact.rank === "Canon"}
          >
            {nextRank} へ昇格
          </button>
        </div>

        <div>
          <h3>保留 (Hold)</h3>
          <p>残り: {hostessCharges.hold}</p>
          <button
            type="button"
            onClick={() => fact && onHoldFact(fact.id)}
            disabled={hostessCharges.hold <= 0 || !fact}
          >
            選択したFactを保留
          </button>
        </div>

        <div>
          <h3>裂け目封印</h3>
          <p>残り: {hostessCharges.seal}</p>
          {rifts.length === 0 ? (
            <p className="muted">封印できる裂け目はありません。</p>
          ) : (
            rifts
              .filter((rift) => rift.status === "open")
              .map((rift) => (
                <div key={rift.id} className="rift-row">
                  <span>{rift.description}</span>
                  <button
                    type="button"
                    onClick={() => onSealRift(rift.id)}
                    disabled={hostessCharges.seal <= 0}
                  >
                    封印
                  </button>
                </div>
              ))
          )}
        </div>
      </div>
    </section>
  );
};
