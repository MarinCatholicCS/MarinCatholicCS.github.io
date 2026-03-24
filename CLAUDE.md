# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

This is a React + Vite project using JavaScript (JSX).

**Install dependencies:** `npm install`

**Local development:** `npm run dev` — starts Vite dev server with HMR.

**Build:** `npm run build` — outputs to `dist/`.

**Deployment:** Push to the `main` branch; GitHub Pages auto-deploys. May need a GitHub Actions workflow for Vite build output.

## Architecture

Single-page React app for the Marin Catholic Computer Science Club, styled as an interactive desktop OS simulation (MC-OS).

- **`src/App.jsx`** — Main app component. Manages window lifecycle, app launching, keyboard shortcuts, boot sequence.
- **`src/components/`** — React components: Panel, Window, DesktopIcons, ContextMenu, CommandPalette, SnapPreview, WallpaperCanvas, Toast.
- **`src/apps/`** — Imperative DOM builders for app window contents: buildTerminal, buildProjects, buildAbout, buildBrowser. These use direct DOM manipulation for complex animations.
- **`src/hooks/`** — Custom hooks: useWindowManager (window state), useDecryptEffect (scramble→reveal text animation).
- **`src/data/constants.js`** — All club data (projects, hackathons, officers) and app icon SVGs.
- **`src/utils/musicPlayer.js`** — YouTube IFrame API wrapper for background music.
- **`src/styles.css`** — All styles. Retro hacker terminal aesthetic: green-on-black, scanlines, CRT effects.

## Data

All club data (projects, hackathons, officers) is in `src/data/constants.js`. To update club info, edit those objects directly.

Project links are relative paths assuming sibling repos are deployed alongside this one (e.g., `../getmo/`, `../mosweeper/`).
