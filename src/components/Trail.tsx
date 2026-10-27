import { Icon, type IconName } from "./Icon";
import type { LogEntry, Outcome } from "../data";

const MARK: Record<Outcome, IconName> = { approved: "tick", declined: "close", redirected: "back" };

export function Trail({ log, waiting }: { log: LogEntry[]; waiting: number }) {
  return (
    <section className="trail">
      <div>
        <h2>Recent decisions</h2>
        <p className="cap">Append-only. Every decision is attributed to a person.</p>
        <ol>
          {log.map((l, i) => (
            <li key={`${l.t}-${i}`}>
              <time>{l.t}</time>
              <span>
                <span className={`tick ${l.o}`}><Icon name={MARK[l.o]} /></span>
                You {l.o} <b>{l.issue}</b> {l.kind} from {l.agent}
                {l.note && <> <em>({l.note})</em></>}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h2>On the dashboard</h2>
        <p className="cap">Replaces the offline "Your agents" table.</p>
        <div className={waiting ? "strip" : "strip clear"}>
          {waiting
            ? `${waiting} ${waiting === 1 ? "request is" : "requests are"} waiting on you`
            : "Nothing waiting on you"}
        </div>
      </div>
    </section>
  );
}
