import { SessionLogEntry, TavernCore } from "../models/types";

interface WorldLedgerProps {
  core: TavernCore;
  sessionLogs: SessionLogEntry[];
}

export const WorldLedger = ({ core, sessionLogs }: WorldLedgerProps) => {
  return (
    <div>
      <h2>世界台帳</h2>
      <div className="grid">
        <div>
          <h3>Facts (真実ランク)</h3>
          <ul>
            {core.facts.map((fact) => (
              <li key={fact.id}>
                <strong>{fact.rank}</strong> - {fact.text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Threads (未解決スレッド)</h3>
          <ul>
            {core.threads.map((thread) => (
              <li key={thread.id}>
                <strong>{thread.title}</strong> ({thread.status}) - 進行 {thread.progress}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Rifts (裂け目)</h3>
          <ul>
            {core.rifts.map((rift) => (
              <li key={rift.id}>
                裂け目 {rift.id.slice(0, 4)}... (darkness {rift.darknessCost}) - {rift.status}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card">
        <h3>闇の残高</h3>
        <p>{core.meta.darkness}</p>
      </div>
      <div className="log">
        <h3>セッションログ</h3>
        {sessionLogs.map((log) => (
          <div key={log.id} className="log-line">
            <span className={`tag type-${log.type}`}>{log.type}</span> {log.message}
          </div>
        ))}
      </div>
    </div>
  );
};
