import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useIsPresent } from "framer-motion";
import { LABEL, VERB, type Agent, type Outcome, type Request } from "../data";
import { Icon } from "./Icon";

interface Props {
  request: Request;
  agent: Agent;
  shortcuts: boolean;
  onResolve: (id: string, outcome: Outcome, note?: string) => void;
  onMore: (id: string) => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export function DecisionCard({ request: r, agent, shortcuts, onResolve, onMore }: Props) {
  const present = useIsPresent();
  const [redirectOpen, setRedirectOpen] = useState(false);
  const [note, setNote] = useState("");
  const [hint, setHint] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (redirectOpen) input.current?.focus();
  }, [redirectOpen]);

  // A, R and D act on the card in focus; paused while the card is leaving or the dialog is open.
  useEffect(() => {
    if (!shortcuts || !present) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName)) return;
      const k = e.key.toLowerCase();
      if (k === "a") onResolve(r.id, "approved");
      else if (k === "d") onResolve(r.id, "declined");
      else if (k === "r") {
        e.preventDefault();
        setRedirectOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [shortcuts, present, onResolve, r.id]);

  function send(e: FormEvent) {
    e.preventDefault();
    const v = note.trim();
    if (!v) {
      setHint(true);
      input.current?.focus();
      return;
    }
    onResolve(r.id, "redirected", v);
  }

  return (
    <motion.article
      className="fc"
      initial={{ opacity: 0, y: 12, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease } }}
      exit={{ opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.18, ease } }}
    >
      <div className="who">
        <span className="av" aria-hidden="true">{agent.name.charAt(0)}</span>
        <span>
          <b>{agent.name}</b> <span className="verb">{VERB[r.kind]}</span>
        </span>
        <span className="when">{r.when}</span>
      </div>
      <p className="ref">{r.issue}</p>
      <h2 className="fc-title">{r.title}</h2>
      <p className="fc-prop">{r.proposal}</p>
      <dl className="facts">
        <div>
          <dt>Type</dt>
          <dd>{LABEL[r.kind]}</dd>
        </div>
        <div>
          <dt>Self-reported confidence</dt>
          <dd>
            {r.confidence}%
            <span className="meter" aria-hidden="true"><i style={{ width: `${r.confidence}%` }} /></span>
          </dd>
        </div>
      </dl>
      <details>
        <summary>Why the agent thinks so</summary>
        <p>{r.reason}</p>
        <button className="more" type="button" onClick={() => onMore(r.id)}>See more</button>
      </details>
      <div className="actions">
        <button className="btn go" type="button" onClick={() => onResolve(r.id, "approved")}><Icon name="tick" />Approve</button>
        <button className="btn" type="button" onClick={() => setRedirectOpen((o) => !o)}><Icon name="back" />Redirect</button>
        <button className="btn no" type="button" onClick={() => onResolve(r.id, "declined")}><Icon name="close" />Decline</button>
        <span className="keys"><kbd>A</kbd> <kbd>R</kbd> <kbd>D</kbd></span>
      </div>
      <form className="redirect" hidden={!redirectOpen} onSubmit={send}>
        <label className="sr-only" htmlFor="note">Instruction for {agent.name}</label>
        <input id="note" ref={input} type="text" value={note} autoComplete="off" placeholder={`Tell ${agent.name} what to do instead`} onChange={(e) => { setNote(e.target.value); setHint(false); }} />
        <button className="btn go" type="submit">Send back</button>
        <p className="hint" hidden={!hint}>Add a short instruction so the agent knows what to change.</p>
      </form>
    </motion.article>
  );
}
