# Ziki Agents

A design proposal for [Ziki](https://ziki.dev/): a better way for people and AI agents to work together.

Ziki's pitch is that agents ask before they act and people make the call. Today that decision is spread across issue comments. This sample puts it in one place: an Agents page where each agent's requests wait for you, and you approve, redirect or decline in a click.

Built for the HNG 15 individual task.

## The idea

- **One decision in focus.** The page opens on the request that needs you most, with who is asking, what they propose and how confident they are.
- **Approve, redirect or decline.** Redirect sends the agent back with a one-line instruction. Every choice is attributed to a person.
- **A clear breakdown.** "See more" opens a dialog with a Plain view for non-technical owners and a Technical view for engineers.
- **Agents as teammates.** A slim rail shows who is online and who is waiting on you. Clicking an agent jumps to their request.
- **Audit trail.** Every decision is logged with a time and stays visible.
- **Up next.** The rest of the queue sits quietly below, and you can pull any request forward.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `A` | Approve the request in focus |
| `R` | Open the redirect field |
| `D` | Decline the request in focus |

Shortcuts pause while the breakdown dialog is open.

## Run it

Built with Vite, React, TypeScript and Framer Motion.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check, then build to dist/
npm run preview  # serve the production build
```

## Motion

Switching to the next decision is a short fade and 8 to 12px slide with a slight scale, so the card feels like it hands over to the next one. The "Up next" list reflows with the same restraint. Animations follow the system "reduce motion" setting.

## Deploy

`vercel.json` tells Vercel to use the Vite framework and publish `dist/`, so no manual settings are needed. Import the repo on Vercel and every push to `main` redeploys.

## Notes

- All agents, issues and decisions are sample data. Nothing is saved and no backend is called.
- The only external resource is the Inter and JetBrains Mono fonts from Google Fonts. Icons are inline SVG from [Hugeicons](https://hugeicons.com) (free set, MIT license).
- Light by default, with a dark theme behind the theme toggle.
