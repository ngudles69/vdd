# Crochet Design Editor — Codex Build Spec

## 1. Goal

Build a frontend-only crochet design editor using Excalidraw as the drawing engine, with a Canva-like UI shell.

The app must support:

1. Template gallery.
2. Fixed canvas/artboard sizes.
3. Left toolbar.
4. Crochet symbol library.
5. Editor-only guide overlays.
6. Multiple grid/guide overlays.
7. Overlay visibility, opacity, lock/unlock, transform controls.
8. Group manager.
9. JSON save/load.
10. PNG/SVG export.
11. Export selected groups.
12. Export blinking/pulsing clips per group.

No backend. The webpage is the app.

---

## 2. Recommended Stack

1. React.
2. Vite.
3. TypeScript.
4. Excalidraw npm package: `@excalidraw/excalidraw`.
5. Zustand for app state.
6. Tailwind CSS for Canva-like UI.
7. SVG overlay renderer for guides/grids.
8. Browser File System APIs where available.
9. JSZip for multi-file export bundles.
10. ffmpeg.wasm only later for video/GIF/WebM export.

---

## 3. Core Architecture

Use Excalidraw only as the canvas engine.

Do not use Excalidraw as the whole app UI.

```txt
src/
  app/
    App.tsx
    layout/
      TopBar.tsx
      LeftToolbar.tsx
      RightPanel.tsx
      CanvasShell.tsx
  editor/
    ExcalidrawHost.tsx
    excalidrawApi.ts
    sceneAdapter.ts
  guides/
    GuideOverlay.tsx
    guideTypes.ts
    guideStore.ts
    renderSquareGrid.tsx
    renderPolarGrid.tsx
    renderRadialGuide.tsx
  templates/
    TemplateGallery.tsx
    templateTypes.ts
    templateLoader.ts
  symbols/
    SymbolLibrary.tsx
    crochetSymbols.ts
  groups/
    GroupPanel.tsx
    groupStore.ts
    groupExport.ts
  export/
    exportArtboard.ts
    exportGroup.ts
    exportBlinkClip.ts
    exportBundle.ts
  state/
    appStore.ts
  types/
    projectTypes.ts
```

---

## 4. UI Layout

```txt
┌──────────────────────────────────────────────────────┐
│ TopBar: file / canvas size / undo / redo / export    │
├──────────────┬────────────────────────┬──────────────┤
│ LeftToolbar  │ CanvasShell             │ RightPanel   │
│              │                        │              │
│ Templates    │ Fixed artboard          │ Properties   │
│ Symbols      │ Excalidraw canvas       │ Guides       │
│ Guides       │ SVG guide overlay       │ Groups       │
│ Text         │ Grey outer workspace    │ Export       │
│ Export       │                        │              │
└──────────────┴────────────────────────┴──────────────┘
```

---

## 5. Canvas / Artboard Model

Excalidraw is infinite canvas by default.

Add a fixed artboard system:

1. Artboard defines the printable/exportable area.
2. Artboard may be A4, square, 9:16, custom, etc.
3. Show grey workspace outside the artboard.
4. Export only artboard bounds by default.
5. Allow export of selected group bounds.

Supported preset sizes:

```ts
type ArtboardPreset =
  | "A4_PORTRAIT"
  | "A4_LANDSCAPE"
  | "SQUARE"
  | "TIKTOK_9_16"
  | "CUSTOM";
```

Example:

```ts
type Artboard = {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: "px" | "mm";
  backgroundColor: string;
};
```

---

## 6. Project File Format

Save everything into one JSON file.

```ts
type CrochetProject = {
  version: 1;
  name: string;
  createdAt: string;
  updatedAt: string;

  artboard: Artboard;

  excalidraw: {
    elements: any[];
    appState: any;
    files: Record<string, any>;
  };

  guides: GuideLayer[];

  groups: CrochetGroup[];

  metadata: {
    category?: string;
    tags?: string[];
    notes?: string;
  };
};
```

---

## 7. Guide Overlay System

Guides are editor overlays, not Excalidraw elements.

They should be stored outside the Excalidraw scene.

### Guide Types

```ts
type GuideType =
  | "square-grid"
  | "polar-grid"
  | "radial-guide"
  | "custom-svg-guide";
```

### Guide Object

```ts
type GuideLayer = {
  id: string;
  name: string;
  type: GuideType;

  visible: boolean;
  locked: boolean;
  opacity: number;

  color: string;
  strokeWidth: number;

  position: { x: number; y: number };
  rotation: number;
  scale: number;

  snapEnabled: boolean;
  exportable: boolean;

  config: SquareGridConfig | PolarGridConfig | RadialGuideConfig | CustomSvgGuideConfig;
};
```

### Square Grid Config

```ts
type SquareGridConfig = {
  spacing: number;
  majorEvery?: number;
};
```

### Polar Grid Config

```ts
type PolarGridConfig = {
  rings: number;
  ringSpacing: number;
  angleStep: number;
};
```

### Radial Guide Config

```ts
type RadialGuideConfig = {
  spokes: number;
  radius: number;
};
```

### Custom SVG Guide Config

```ts
type CustomSvgGuideConfig = {
  svg: string;
  width: number;
  height: number;
};
```

---

## 8. Guide Features

Each guide must support:

1. Show/hide.
2. Lock/unlock movement.
3. Opacity slider.
4. Color.
5. Stroke width.
6. Position X/Y.
7. Rotation.
8. Scale.
9. Snap enable/disable.
10. Export include/exclude.
11. Delete.
12. Rename.

Guides should render in a separate SVG overlay above or below Excalidraw.

Do not modify Excalidraw core to support guides unless unavoidable.

---

## 9. Template Gallery

Templates are local files bundled with the app.

```txt
public/templates/
  granny-square/
    design.json
    preview.png
  circular-motif/
    design.json
    preview.png
  flower-border/
    design.json
    preview.png
```

### Template Manifest

```json
[
  {
    "id": "granny-square",
    "name": "Granny Square",
    "category": "Crochet",
    "preview": "/templates/granny-square/preview.png",
    "design": "/templates/granny-square/design.json",
    "tags": ["square", "beginner", "motif"]
  }
]
```

### Template Flow

1. User opens template gallery.
2. User selects template.
3. App loads template JSON.
4. App imports Excalidraw scene.
5. App imports guides.
6. App imports group metadata.
7. User edits freely.
8. User saves edited version as new JSON.

---

## 10. Crochet Symbol Library

Start simple.

Use SVG symbols inserted into Excalidraw as images or grouped vector elements.

Left toolbar symbol categories:

1. Basic stitches.
2. Increase/decrease.
3. Motifs.
4. Arrows/flow.
5. Labels.
6. Borders.

Symbol data:

```ts
type CrochetSymbol = {
  id: string;
  name: string;
  category: string;
  svg: string;
  defaultWidth: number;
  defaultHeight: number;
  tags: string[];
};
```

Do not build a custom Excalidraw shape engine initially.

---

## 11. Group Manager

Use Excalidraw grouping where possible.

Add app-level group metadata.

```ts
type CrochetGroup = {
  id: string;
  name: string;
  excalidrawElementIds: string[];

  visible?: boolean;
  locked?: boolean;

  exportSettings: {
    format: "png" | "svg" | "webm" | "gif" | "apng";
    includeGuides: boolean;
    transparentBackground: boolean;
    padding: number;
  };

  effect?: {
    type: "none" | "blink" | "pulse-opacity" | "highlight-outline";
    durationMs: number;
    loop: boolean;
    opacityFrom?: number;
    opacityTo?: number;
  };
};
```

Group panel features:

1. List groups.
2. Rename group.
3. Select group.
4. Hide/show group.
5. Lock/unlock group.
6. Export group.
7. Apply effect.
8. Preview blinking/pulsing effect.
9. Export each group as one file.
10. Export all groups as ZIP.

---

## 12. Export Requirements

### Full Design Export

1. Export artboard as PNG.
2. Export artboard as SVG.
3. Optionally include guide overlays.
4. Optionally exclude guide overlays.

### Group Export

1. Select group by metadata.
2. Compute bounds from Excalidraw elements.
3. Add padding.
4. Export only those elements.
5. Include selected guide overlays only if enabled.
6. Export as PNG/SVG.

### Blinking Clip Export

Initial implementation:

1. Generate a sequence of frames in browser.
2. Frame A: group visible.
3. Frame B: group transparent or highlighted.
4. Repeat for duration.
5. Export later as:
   1. animated SVG, easiest first
   2. APNG, optional
   3. GIF/WebM via ffmpeg.wasm later

Start with animated SVG before ffmpeg.wasm.

Example animated SVG effect:

```svg
<animate attributeName="opacity"
         values="1;0.2;1"
         dur="1s"
         repeatCount="indefinite" />
```

---

## 13. Save / Load

Implement:

1. Save project JSON.
2. Load project JSON.
3. Export `.crochet.json`.
4. Import `.crochet.json`.
5. Autosave to localStorage or IndexedDB.
6. Restore last project.

No backend.

---

## 14. Canva-like Reskin

Build a custom React shell.

Do not deeply rewrite Excalidraw UI at first.

### Top Bar

1. Project name.
2. Canvas size.
3. Undo.
4. Redo.
5. Save.
6. Load.
7. Export.

### Left Toolbar

1. Templates.
2. Symbols.
3. Guides.
4. Shapes.
5. Text.
6. Groups.
7. Export.

### Right Panel

Context-sensitive:

1. Selected object properties.
2. Selected guide properties.
3. Selected group properties.
4. Export settings.

### Canvas Shell

1. Center fixed artboard.
2. Grey outer workspace.
3. Optional rulers.
4. Optional guides.
5. Zoom controls.
6. Pan controls.

---

## 15. Development Phases

### Phase 1 — Basic App Shell

1. Create Vite React TypeScript app.
2. Install Excalidraw.
3. Render Excalidraw in CanvasShell.
4. Add TopBar, LeftToolbar, RightPanel.
5. Add basic artboard rectangle/bounds.
6. Add save/load Excalidraw scene JSON.

Success condition:

1. User can draw.
2. User can save/load.
3. App looks like custom editor, not default Excalidraw.

---

### Phase 2 — Template Gallery

1. Add template manifest.
2. Add gallery UI.
3. Load template JSON into editor.
4. Add preview thumbnails.
5. Allow save-as-new project.

Success condition:

1. User can start from premade crochet templates.

---

### Phase 3 — Guide Overlay System

1. Add guide store.
2. Add square grid overlay.
3. Add polar grid overlay.
4. Add guide panel.
5. Add visibility/opacity/lock controls.
6. Add position/rotation/scale controls.

Success condition:

1. User can add multiple guide overlays.
2. User can control opacity.
3. User can lock/unlock guide position.
4. Guides are not normal drawing objects.

---

### Phase 4 — Crochet Symbol Library

1. Add SVG symbol list.
2. Add drag/click insert into canvas.
3. Add categories.
4. Add search/filter.
5. Store symbol metadata if possible.

Success condition:

1. User can quickly place crochet symbols onto the artboard.

---

### Phase 5 — Group Manager

1. Read Excalidraw group data or selected element IDs.
2. Create app-level group records.
3. Add group panel.
4. Rename/select/hide/lock groups.
5. Store groups in project JSON.

Success condition:

1. User can manage groups from a panel.

---

### Phase 6 — Static Export

1. Export full artboard PNG.
2. Export full artboard SVG.
3. Export selected group PNG.
4. Export selected group SVG.
5. Include/exclude guides.

Success condition:

1. Each group can be exported as its own file.

---

### Phase 7 — Blinking Clip Export

1. Add effect settings to group.
2. Add live preview.
3. Export animated SVG first.
4. Add ZIP export for all groups.
5. Add ffmpeg.wasm only if GIF/WebM is required.

Success condition:

1. Each group can export as a blinking animated clip file.

---

## 16. Important Build Decisions

1. Use Excalidraw as engine, not app.
2. Keep guides outside Excalidraw.
3. Keep templates outside Excalidraw.
4. Keep group metadata in app JSON wrapper.
5. Do not implement full layers.
6. Do not build timeline editor initially.
7. Do not build backend.
8. Do not implement multiplayer.
9. Do not implement custom shape engine initially.
10. Build animated SVG before GIF/WebM.

---

## 17. Known Risks

1. Excalidraw export APIs may need adapter work.
2. Group export may require manually filtering elements.
3. Guide overlay alignment must track Excalidraw zoom/pan.
4. Canva-like polish requires custom UI work.
5. GIF/WebM export may be heavy in browser.
6. Locking/hiding Excalidraw groups may require custom handling.

---

## 18. First Codex Task

Build Phase 1.

Prompt for Codex:

```txt
Create a Vite React TypeScript app for a frontend-only crochet design editor.

Use @excalidraw/excalidraw as the drawing engine.

Implement:
1. App layout with TopBar, LeftToolbar, CanvasShell, RightPanel.
2. Embedded Excalidraw editor in CanvasShell.
3. Fixed artboard preset system with A4 portrait, A4 landscape, square, TikTok 9:16, and custom.
4. Project JSON save/load using browser file picker or download/upload fallback.
5. Store project as a wrapper JSON containing artboard + Excalidraw scene.
6. Use Zustand for state.
7. Use Tailwind for styling.
8. Do not add backend.
9. Do not implement templates/guides/groups yet, but create folders/types for future phases.

Keep code modular and TypeScript strict.
```

---

## 19. Source Notes

Excalidraw supports an embeddable npm package, infinite canvas, shape libraries, export to PNG/SVG/clipboard, and open JSON scene format. Its GitHub repository describes it as free and open-source. Use the official Excalidraw package and repository as the implementation reference.
