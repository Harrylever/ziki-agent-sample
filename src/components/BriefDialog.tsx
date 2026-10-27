import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BRIEF, LABEL, type Agent, type Outcome, type Request } from "../data";
import { Icon } from "./Icon";

const TABS = [["plain", "Plain"], ["tech", "Technical"]] as const;

interface Props {
  request: Request | null;
  agent: Agent | null;
  onClose: () => void;
  onDecide: (id: string, outcome: Outcome) => void;
}

export function BriefDialog({ request, agent, onClose, onDecide }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<"plain" | "tech">("plain");

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (request && !d.open) {
      setMode("plain");
      d.showModal();
    } else if (!request && d.open) d.close();
  }, [request]);

  const rows = request ? BRIEF[request.id][mode] : [];

  return (
    <dialog
      ref={dialog}
      aria-labelledby="dl-title"
      onClose={onClose}
      onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}
    >
      {request && agent && (
        <div className="dl">
          <div className="dl-top">
            <p className="ref" style={{ margin: 0 }}>{request.issue} &middot; {LABEL[request.kind]} from {agent.name}</p>
            <button className="dl-x" type="button" aria-label="Close" onClick={() => dialog.current?.close()}><Icon name="close" /></button>
          </div>
          <h2 id="dl-title">{request.title}</h2>
          <div className="seg" role="group" aria-label="Level of detail">
            {TABS.map(([key, name]) => (
              <button key={key} type="button" aria-pressed={mode === key} onClick={() => setMode(key)}>
                {mode === key && <motion.span layoutId="seg-pill" className="seg-pill" transition={{ type: "spring", stiffness: 520, damping: 38 }} />}
                <span className="seg-label">{name}</span>
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.dl
              key={mode}
              className="brief"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
            >
              {rows.map(([label, text]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </motion.dl>
          </AnimatePresence>
          <div className="dl-foot">
            <button className="btn go" type="button" onClick={() => onDecide(request.id, "approved")}><Icon name="tick" />Approve</button>
            <button className="btn no" type="button" onClick={() => onDecide(request.id, "declined")}><Icon name="close" />Decline</button>
          </div>
        </div>
      )}
    </dialog>
  );
}
