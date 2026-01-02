import React from "react";
import { Fact, Rift, Thread } from "../data/models";

interface WorldLedgerViewProps {
  facts: Fact[];
  threads: Thread[];
  rifts: Rift[];
  darkness: number;
}

export const WorldLedgerView: React.FC<WorldLedgerViewProps> = ({ facts, threads, rifts, darkness }) => {
  return (
    <section className="panel">
      <h2>World Ledger</h2>
      <p className="darkness">Darkness: {darkness}</p>

      <div className="ledger-section">
        <h3>Facts</h3>
        {facts.map((fact) => (
          <div key={fact.id} className="ledger-card">
            <span className={`badge rank-${fact.rank.toLowerCase()}`}>{fact.rank}</span>
            <p>{fact.text}</p>
            <small>Updated: {new Date(fact.updatedAt).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div className="ledger-section">
        <h3>Open Threads</h3>
        {threads.map((thread) => (
          <div key={thread.id} className="ledger-card">
            <strong>{thread.title}</strong>
            <p>進行度: {thread.progress}</p>
            <p>状態: {thread.status}</p>
            <small>{thread.notes.join(" / ")}</small>
          </div>
        ))}
      </div>

      <div className="ledger-section">
        <h3>Rifts</h3>
        {rifts.length === 0 ? (
          <p className="muted">裂け目はありません。</p>
        ) : (
          rifts.map((rift) => (
            <div key={rift.id} className="ledger-card">
              <strong>{rift.description}</strong>
              <p>状態: {rift.status}</p>
              <p>Darkness Cost: {rift.darknessCost}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
