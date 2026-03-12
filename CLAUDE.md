# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

This is a static site — no build step, no package manager, no dependencies.

**Local development:** Open with VS Code Live Server on port 5501 (configured in `.vscode/settings.json`), or any static file server.

**Deployment:** Push to the `main` branch; GitHub Pages auto-deploys.

## Architecture

Single-page static website for the Marin Catholic Computer Science Club, styled as an interactive retro CRT terminal.

- **[index.html](index.html)** — Minimal HTML shell. Just a `#terminal-window` div; all content is injected by JS.
- **[script.js](script.js)** — All application logic. On load it runs a typing animation, then sequentially displays hackathons, projects, and officers. Also handles a command prompt (user can type commands like `help`, `clear`, `whoami`, `mc`, `sudo`, `ozymandias`).
- **[styles.css](styles.css)** — Retro terminal aesthetic: green-on-black (`#00ff41` on `#0a0a12`), scanline overlay, blinking cursor, gold (`#ffd700`) for award highlights.

## Data

All club data (projects, hackathons, officers) is hardcoded as JS objects in [script.js](script.js). To update club info, edit those objects directly — no external config or CMS.

Project links are relative paths assuming sibling repos are deployed alongside this one (e.g., `../getmo/`, `../mosweeper/`).
