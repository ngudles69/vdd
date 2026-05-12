# Crochet Design Editor

Frontend-only crochet design editor built with Vite, React, TypeScript, Excalidraw, Zustand, and Tailwind CSS.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

The app is browser-only and can be hosted from the generated `dist/` folder.

## End-to-End Smoke Test

```bash
npx playwright install chromium-headless-shell
npm run test:e2e
```

The smoke test runs headless and captures `test-results/editor-smoke.png`.

## GitHub Pages

Pushes to `main` run the GitHub Pages deployment workflow. In the GitHub repo,
set Pages source to `GitHub Actions`, then open the published Pages URL.
