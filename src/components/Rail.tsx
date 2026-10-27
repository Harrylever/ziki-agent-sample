import { agents, type Request } from "../data";

export function AgentRail({ open, onPick }: { open: Request[]; onPick: (id: string) => void }) {
  return (
    <aside className="rail" aria-label="Agents">
      <h2>Agents</h2>
      <div>
        {agents.map((a) => {
          const waiting = open.filter((r) => r.agent === a.id);
          return (
            <button
              key={a.id}
              className={a.on ? "ag" : "ag off"}
              type="button"
              disabled={waiting.length === 0}
              onClick={() => onPick(waiting[0].id)}
            >
              <span className="pv">
                <span className="av" aria-hidden="true">{a.name.charAt(0)}</span>
                <i className={a.on ? "pres on" : "pres"} />
              </span>
              <span className="t">
                <b>{a.name}</b>
                <span className={waiting.length ? "w" : ""}>{waiting.length ? "Waiting on you" : a.base}</span>
              </span>
              {waiting.length > 0 && <span className="n">{waiting.length}</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
