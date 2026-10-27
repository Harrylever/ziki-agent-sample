import { AnimatePresence, motion } from "framer-motion";
import { LABEL, type Request } from "../data";

export function UpNext({ requests, onPick }: { requests: Request[]; onPick: (id: string) => void }) {
  if (requests.length === 0) return null;
  return (
    <div className="next">
      <h2>Up next</h2>
      <ul>
        <AnimatePresence initial={false}>
          {requests.map((r) => (
            <motion.li
              key={r.id}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button className="nx" type="button" onClick={() => onPick(r.id)}>
                <span className="k">{LABEL[r.kind]}</span>
                <span className="nx-t"><em>{r.issue}</em>{r.title}</span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
