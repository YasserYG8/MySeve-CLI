# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`yassergombra` is an interactive terminal CV, published to npm and run with `npx yassergombra`. It uses Ink 4 (React for the terminal) and TypeScript, and has an AI chat that answers questions about Yasser. The `proxy/` folder is a separate Vercel Edge function.

## Commands

```bash
npm install
npm start               # run from source (needs Bun: bun run src/index.tsx)
npm run dev             # run from source and restart on change (needs Bun)
npm run build           # compile src/ to dist/ with tsc
node dist/index.js      # run the built CLI, as npx users get it
npx tsc --noEmit        # type-check only
```

There are no tests and no linter. Use the type-check and a manual run to verify changes.

The README says `npm run dev` compiles and needs `npm start` in a second terminal. This is out of date: `npm run dev` is enough.

### Publishing

- CLI: run `npm run build`, then `npm publish`. Nothing builds on publish, so a stale `dist/` will ship without the build step.
- There is no `files` field or `.npmignore`, so npm publishes everything not in `.gitignore`.
- Proxy: run `vercel --prod` from `proxy/`. It needs `OPENROUTER_API_KEY` set on Vercel. The proxy deploys on its own, so publishing the CLI does not update it.

## Architecture

### Chat has two backends

`sendMessage` in `src/hooks/useChat.ts` picks the path at request time:

- **`OPENROUTER_API_KEY` is set** (local dev, loaded from `.env` in the current directory): calls OpenRouter directly with the `openai` SDK, model `openrouter/free`.
- **No key** (npm users): POSTs to `CHAT_PROXY_URL`, or to the default `https://proxyclipart.vercel.app/api/chat`. `proxy/api/chat.js` holds the key and its own hardcoded model.

Things to know:

- The two paths use different models, so a local test does not show what npm users get. To change the model for npm users, edit and redeploy the proxy.
- The client sends the system prompt in `messages`. The proxy does not add it.
- The proxy turns OpenRouter's SSE stream into plain text chunks, so the client reads raw text on this path. It also removes a leading `user safety: safe` line that the model can emit.

### Facts about Yasser live in two places

- `src/data/profile.ts`: used by the static views and the header.
- `src/constants/prompts.ts`: a hand-written copy inside the AI system prompt.

Update both when CV facts change. `CV.md` is a reference copy that the app does not read, so update it too. `yassergombra.com` is the official source for these facts.

### Slash commands live in two places

To add or change a command, update both:

- `COMMANDS` in `src/constants/commands.ts` (autocomplete menu and Help screen)
- `sendMessage` in `src/hooks/useChat.ts` (what the command does)

### Views and input

- `src/App.tsx` holds `activeView` and passes a view-change callback into `useChat`, so slash commands can switch views.
- Letter hotkeys (P, S, E, C, H, I, Q) in `App.tsx` work only outside the chat view, because in chat the letters go to the text input. In chat, ESC stops a running response or clears the input, and Tab opens or completes a command.
- `ShortcutsBar` shows the keys that work on the current screen.

### Every screen counts its own rows

The app must never be taller than the terminal, because Ink then redraws badly and clips the top. So text is wrapped in code (`src/utils/text.ts`), not by Ink.

- `App.tsx` computes the height left after the header and the bar, and passes `width` and `height` to each view. The logo hides on short or narrow terminals.
- Static views build a list of blocks with one node per row and give it to `src/components/ScrollView.tsx`, which scrolls them and draws the scrollbar. Their `width` already leaves room for the bar.
- `Chat.tsx` slices visible lines itself. `chromeRows` counts the rows around the messages, so update it if you add rows there.

If you add a row to a screen, count it in that screen's height.

### Colors

Use `src/constants/theme.ts`. Leave body text with no color, because `white` is invisible on a light terminal. The theme uses named ANSI colors so they follow the visitor's terminal theme.

## Conventions

- The project is ESM with `NodeNext` resolution, so relative imports must end in `.js`, even for `.ts` and `.tsx` files.
- Both `package-lock.json` and `bun.lock` are tracked. Keep both in sync when dependencies change.

## Stale or unused files

- `structure.md` is the original build prompt, not current docs. It describes the Anthropic SDK and figlet, which the app no longer uses.
- `src/components/Message.tsx` is not imported anywhere.
- `figlet` and `chalk` are dependencies but are not imported in `src/`.
- `.agents/opentui-skill` holds reference docs for OpenTUI, a different TUI framework. This app uses Ink, so do not follow those docs here.
