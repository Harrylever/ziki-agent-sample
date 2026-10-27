import { useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { agents, type Agent, type Request } from "../data";

function Spark({ agent }: { agent: Agent }) {
  const W = 120, H = 32, max = Math.max(...agent.week) || 1;
  const pts = agent.week.map((v, i) => [(i * W) / (agent.week.length - 1), H - 4 - (v / max) * (H - 10)]);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
  const [ex, ey] = pts[pts.length - 1];
  const g = `g-${agent.id}`;
  return (
    <svg className="pop-spark" viewBox="0 0 120 32" role="img" aria-label="Actions over the last 7 days">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: "var(--accent)", stopOpacity: 0.28 }} />
          <stop offset="1" style={{ stopColor: "var(--accent)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>
      <path d={`${d}L${W} ${H}L0 ${H}Z`} fill={`url(#${g})`} />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={ex} cy={ey} r="3.5" fill="var(--accent)" stroke="var(--surface)" strokeWidth="2" />
    </svg>
  );
}

function AgentItem({ agent: a, waiting, onPick }: { agent: Agent; waiting: Request[]; onPick: (id: string) => void }) {
  const [show, setShow] = useState(false);
  const timer = useRef<number>();
  const popId = useId();

  const enter = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShow(true), 120);
  };
  const leave = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShow(false), 80);
  };
  const total = a.week.reduce((n, v) => n + v, 0);

  return (
    <div className="ag-wrap" onMouseEnter={enter} onMouseLeave={leave} onFocus={enter} onBlur={leave}>
      <button
        className={a.on ? "ag" : "ag off"}
        type="button"
        aria-disabled={waiting.length === 0}
        aria-describedby={show ? popId : undefined}
        onClick={() => waiting.length && onPick(waiting[0].id)}
        onKeyDown={(e) => { if (e.key === "Escape") setShow(false); }}
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
      <AnimatePresence>
        {show && (
          <motion.div
            id={popId}
            role="tooltip"
            className="pop"
            initial={{ opacity: 0, scale: 0.97, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.1 } }}
          >
            <div className="pop-head">
              <span className="pv">
                <span className="av" aria-hidden="true">{a.name.charAt(0)}</span>
                <i className={a.on ? "pres on" : "pres"} />
              </span>
              <div>
                <b>{a.name}</b>
                <span>{a.kind} &middot; {a.seen}</span>
              </div>
            </div>
            <p>{a.about}</p>
            <div className="pop-stats">
              <dl>
                <div><dt>Asks before</dt><dd>{a.asks.join(", ")}</dd></div>
                <div><dt>Approved by you</dt><dd>{a.approval}%</dd></div>
                <div><dt>Last 7 days</dt><dd>{total} {total === 1 ? "action" : "actions"}</dd></div>
              </dl>
              <Spark agent={a} />
            </div>
            <div className="pop-can">
              <span><b>Can:</b> {a.can}</span>
              <span><b>Can't:</b> {a.cannot}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AgentRail({ open, onPick }: { open: Request[]; onPick: (id: string) => void }) {
  return (
    <aside className="rail" aria-label="Agents">
      <h2>Agents</h2>
      <div>
        {agents.map((a) => (
          <AgentItem key={a.id} agent={a} waiting={open.filter((r) => r.agent === a.id)} onPick={onPick} />
        ))}
      </div>
    </aside>
  );
}
