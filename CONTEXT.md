# Project Context

## Current Status

- Repository contains planning material only.
- Main specification: `research/crochet_design_editor_codex_spec.md`.
- Contributor guide added: `AGENTS.md`.
- No Vite/React app has been scaffolded yet.
- No package manager files, tests, build scripts, or Git metadata are present.

## TODOs

- Scaffold a Vite React TypeScript app.
- Install and configure `@excalidraw/excalidraw`, Zustand, and Tailwind CSS.
- Create the planned `src/` module structure from the specification.
- Implement Phase 1:
  - App shell with `TopBar`, `LeftToolbar`, `CanvasShell`, and `RightPanel`.
  - Embedded Excalidraw editor.
  - Fixed artboard presets: A4 portrait, A4 landscape, square, TikTok 9:16, and custom.
  - Project JSON save/load wrapper for artboard and Excalidraw scene data.
- Add placeholder folders/types for future templates, guides, symbols, groups, export, state, and shared types.
- Add initial development commands to `package.json`.
- Add focused tests once app logic exists.
