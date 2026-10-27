import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { agents, initialLog, initialRequests, type LogEntry, type Outcome, type Request } from "./data";
import { DecisionCard } from "./components/DecisionCard";
import { UpNext } from "./components/UpNext";
import { AgentRail } from "./components/Rail";
import { BriefDialog } from "./components/BriefDialog";
import { Trail } from "./components/Trail";
import { Icon } from "./components/Icon";

const agentOf = (id: string) => agents.find((a) => a.id === id)!;

export default function App() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [log, setLog] = useState<LogEntry[]>(initialLog);
  const [focusId, setFocusId] = useState<string | null>(null);
  const [briefId, setBriefId] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const open = requests.filter((r) => !r.outcome);
  const focus = open.find((r) => r.id === focusId) ?? open[0];
  const rest = open.filter((r) => r.id !== focus?.id);
  const brief = requests.find((r) => r.id === briefId) ?? null;

  const resolve = useCallback((id: string, outcome: Outcome, note?: string) => {
    setBriefId(null);
    setFocusId(null);
    setRequests((rs) => rs.map((r) => (r.id === id ? { ...r, outcome } : r)));
    const r = initialRequests.find((x) => x.id === id)!;
    const t = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    setLog((l) => [{ t, o: outcome, issue: r.issue, kind: r.kind, agent: agentOf(r.agent).name, note }, ...l]);
  }, []);

  const n = open.length;
  const scrollTop = () => window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

  return (
    <>
      <div className="glow" aria-hidden="true" />
      <header className="top">
        <div className="wrap">
          <span className="logo"><i aria-hidden="true" />ziki</span>
          <span className="crumb">/ Zedu / Agents</span>
          <span className="spacer" />
          <button className="theme" type="button" aria-label="Switch colour theme" onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
            <Icon name={theme === "light" ? "moon" : "sun"} />Theme
          </button>
        </div>
      </header>

      <main className="wrap">
        <div className="page">
          <section aria-live="polite">
            <h1>{n ? `${n} ${n === 1 ? "decision" : "decisions"} waiting` : "All caught up"}</h1>
            <p className="sub">Your agents don't act until you decide.</p>
            <AnimatePresence mode="wait" initial={false}>
              {focus ? (
                <DecisionCard
                  key={focus.id}
                  request={focus}
                  agent={agentOf(focus.agent)}
                  shortcuts={!brief}
                  onResolve={resolve}
                  onMore={setBriefId}
                />
              ) : (
                <motion.div
                  key="empty"
                  className="empty"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="ok"><Icon name="tick" /></div>
                  <b>All caught up.</b>
                  New plans, bids and merge requests will appear here.
                </motion.div>
              )}
            </AnimatePresence>
            <UpNext requests={rest} onPick={(id) => { setFocusId(id); scrollTop(); }} />
          </section>
          <AgentRail open={open} onPick={setFocusId} />
          <Trail log={log} waiting={n} />
        </div>
        <p className="foot">Sample data from the Zedu project. Nothing here is saved.</p>
      </main>

      <BriefDialog request={brief} agent={brief ? agentOf(brief.agent) : null} onClose={() => setBriefId(null)} onDecide={resolve} />
    </>
  );
}
