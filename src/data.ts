export type Kind = "plan" | "bid" | "merge";
export type Outcome = "approved" | "declined" | "redirected";
export interface Agent {
  id: string;
  name: string;
  kind: string;
  on: boolean;
  base: string;
  seen: string;
  about: string;
  asks: string[];
  week: number[];
  approval: number;
  can: string;
  cannot: string;
}
export interface Request { id: string; kind: Kind; agent: string; when: string; issue: string; title: string; proposal: string; confidence: number; reason: string; outcome?: Outcome }
export type Row = [label: string, text: string];
export type Brief = Record<string, { plain: Row[]; tech: Row[] }>;
export interface LogEntry { t: string; o: Outcome; issue: string; kind: Kind; agent: string; note?: string }

export const VERB: Record<Kind, string> = { plan: "proposes a plan", bid: "offers to take this", merge: "asks to merge" };
export const LABEL: Record<Kind, string> = { plan: "Plan", bid: "Bid", merge: "Merge" };

export const agents: Agent[] = [
  {
    id: "triager", name: "Bolu Triager", kind: "Personal agent", on: true, base: "Triaging the Web backlog", seen: "Active 2m ago",
    about: "Reads new issues, checks for duplicates and drafts a fix plan for you to approve.",
    asks: ["plans"], week: [3, 5, 2, 6, 4, 8, 7], approval: 90,
    can: "Read issues, comment and propose plans.", cannot: "Start work or merge without your approval.",
  },
  {
    id: "reviewer", name: "Bolu Reviewer", kind: "Personal agent", on: true, base: "Reviewing a pull request", seen: "Active 14m ago",
    about: "Independently verifies fixes and tells you when a pull request is ready to merge.",
    asks: ["merges"], week: [1, 2, 4, 3, 5, 3, 6], approval: 100,
    can: "Read pull requests, run checks and post verdicts.", cannot: "Merge without your approval.",
  },
  {
    id: "claude", name: "Dean's Claude", kind: "Claude", on: false, base: "Last seen 5 days ago", seen: "Last seen 5 days ago",
    about: "Takes on issues you hand it, bids on open work and delivers a pull request.",
    asks: ["bids", "plans"], week: [6, 4, 0, 0, 0, 0, 0], approval: 75,
    can: "Bid on issues and open pull requests.", cannot: "Take an issue or merge without your approval.",
  },
];

export const initialRequests: Request[] = [
    { id: "r1", kind: "plan", agent: "triager", when: "2m ago", issue: "#44", title: "Buzz call participant count uses singular label for two people", proposal: "Pluralise the label in both Buzz call views and add widget tests. Estimate 30 minutes.", confidence: 95, reason: "Reproducible steps and a single component (buzz_meeting_view.dart:118). No duplicate in the catalog." },
    { id: "r2", kind: "merge", agent: "reviewer", when: "14m ago", issue: "#371", title: "Mobile voice recorder swallows errors in empty catch blocks", proposal: "Merge the linked pull request into dev. 14 of 14 checks pass and an independent reviewer verified the exact commit.", confidence: 97, reason: "Reviewer reproduced the bug before the fix and confirmed the error now reaches the user. Sensitive paths are untouched." },
    { id: "r3", kind: "bid", agent: "claude", when: "1h ago", issue: "#112", title: "Web: Billing page fails to clear session_id query parameter and omits subscription status after checkout", proposal: "Take this issue: strip session_id after the checkout redirect and refetch the subscription. Estimate 45 minutes.", confidence: 88, reason: "Matches the pattern fixed in #369. Touches two files in the billing components and needs no API change." },
    { id: "r4", kind: "plan", agent: "triager", when: "3h ago", issue: "#204", title: "Web File Explorer: pinning or unpinning a file is never saved", proposal: "Persist pin state through the files API and roll the toggle back if the request fails. Estimate 1 hour.", confidence: 81, reason: "Likely cause is a missing await on the PATCH call. Lower confidence because the explorer has two code paths that may both need the fix." }
  ];

export const BRIEF: Brief = {
    r1: {
      plain: [["What is happening", "On a Buzz call with two people, the screen says \"2 participant\" instead of \"2 participants\"."], ["What the agent will do", "Fix the wording in both call views so it reads correctly for any number of people, and add checks so it stays fixed."], ["Who it affects", "Anyone on a Buzz call in the desktop app."], ["Risk", "Very low. Only a piece of text changes."], ["Time", "About 30 minutes."]],
      tech: [["Root cause", "The label is built from a hard-coded singular string instead of a count-aware rule."], ["Where", "lib/features/dms/presentation/components/buzz_meeting_view.dart:118 and the full-page call view."], ["Change", "Replace the string with a shared helper: 1 participant, otherwise N participants."], ["Verification", "Widget tests for 1, 2 and 3 participants in the compact and full-page views."], ["Risk", "Low. Presentation only, no state or API change."]]
    },
    r2: {
      plain: [["What is happening", "On mobile, if a voice recording fails, the app hides the problem and the person sees nothing."], ["What the agent will do", "Merge the fix so a clear message appears when recording fails."], ["Who it affects", "People sending voice messages on mobile."], ["Risk", "Low. All 14 automated checks pass and a second agent confirmed the fix."], ["Time", "Merges as soon as you approve."]],
      tech: [["Root cause", "Empty catch blocks in the voice recorder swallow exceptions."], ["Where", "The mobile voice recorder service and its widget."], ["Change", "Propagate the error to the UI and show a user-facing message."], ["Verification", "14 of 14 checks pass. An independent reviewer reproduced the bug before the fix and verified the exact commit."], ["Risk", "Low. Sensitive paths are untouched."]]
    },
    r3: {
      plain: [["What is happening", "After someone pays on the web, the billing page can show out-of-date information and leaves a leftover code in the web address."], ["What the agent will do", "Take this issue: remove the leftover code after checkout and refresh the subscription so the right status shows straight away."], ["Who it affects", "Customers who just subscribed or changed plan on the web."], ["Risk", "Low to medium. It touches the billing screens, so it needs a test-mode checkout before release."], ["Time", "About 45 minutes."]],
      tech: [["Root cause", "The session_id query parameter from the checkout redirect is never cleared, and subscription state is not refetched."], ["Where", "Two files in the web billing components."], ["Change", "Strip session_id with history.replaceState after the redirect, then refetch the subscription."], ["Verification", "Test-mode checkout redirect plus a unit test for the parameter removal."], ["Risk", "Same pattern as #369. No API change."]]
    },
    r4: {
      plain: [["What is happening", "In the web file explorer, pinning or unpinning a file looks like it worked but is forgotten after a reload."], ["What the agent will do", "Save the pin to the server, and undo the change on screen if saving fails."], ["Who it affects", "Anyone who pins files in the web explorer."], ["Risk", "Medium. The agent is less sure because the fix may be needed in two places."], ["Time", "About 1 hour."]],
      tech: [["Root cause", "Likely a missing await on the PATCH request, so the UI updates without confirming the save."], ["Where", "The pin toggle in the web file explorer. Two code paths may need the change."], ["Change", "Persist through the files API with an optimistic update and rollback on error."], ["Verification", "Pin, reload, unpin, and a forced-failure case."], ["Risk", "Medium. Two code paths."]]
    }
  };

export const initialLog: LogEntry[] = [
  { t: "09:12", o: "approved", issue: "#369", kind: "plan", agent: "Bolu Triager" },
  { t: "08:47", o: "declined", issue: "#370", kind: "bid", agent: "Dean's Claude", note: "duplicate of #369" },
];
