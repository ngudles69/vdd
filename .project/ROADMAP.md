# Violet Drizzle Designer Roadmap

## Direction

Violet Drizzle Designer should be split into two related browser-only tools:

- `/editor` is the crochet design editor.
- `/veditor` is the later video and sync editor.

The design editor comes first. The video editor should not be built into the main design surface because timeline, filmstrip, bookmarks, and video export are a different workflow from designing crochet diagrams.

Both tools should share project data where useful, but each page should stay focused on its own job.

## `/editor`: Design Editor

The design editor is the first priority.

Core responsibilities:

- Fixed artboard design surface.
- Excalidraw-based object editing.
- Crochet symbols inserted as Excalidraw elements or files, with app metadata only where needed.
- Text using Excalidraw's native text tool and native text properties where possible.
- Guide overlays, including square grids, polar grids, and radial guides.
- Guide controls for guide-specific behavior: guide type, guide config, show/hide, rename, delete, export inclusion, snap participation, and app-level guide metadata.
- Group manager.
- Object and group metadata.
- Save/load project JSON.
- Static export to PNG, JPG, SVG, and group-specific exports.
- Editable symbol and text properties using Excalidraw defaults where possible.
- Object hover highlight if Excalidraw APIs allow it cleanly.
- Basic animation metadata for objects or groups, starting with blink.

Initial design-editor phases:

1. Save/load project JSON.
2. Guide system and guide controls.
3. Group manager.
4. Static export for artboard and groups.
5. Object/text property editing audit and UI.
6. Hover highlight feasibility.
7. Template and library system.
8. Basic blink animation metadata and preview.

## Use Excalidraw Instead Of Rebuilding

Do not build a parallel object editor for behavior Excalidraw already provides.

Use Excalidraw native behavior for:

- Selecting, moving, resizing, rotating, copying, pasting, duplicating, deleting, undo, and redo.
- Object stroke color, background/fill color, stroke width, stroke style, roughness, opacity, and z-order.
- Text creation and core text editing, including font family, font size, text alignment, vertical alignment, wrapping/auto-resize, and line height where available.
- Image/symbol scaling, rotation, opacity, and horizontal/vertical flip.
- Excalidraw groups and ungrouping.
- Element locking where possible.
- Alignment and distribution where possible.
- Excalidraw grid mode and object snap mode where they satisfy the workflow.
- Base export APIs such as canvas/blob/SVG export.

Build custom code only for app-specific behavior:

- Fixed artboard bounds and export cropping.
- Crochet symbol library metadata and insertion flow.
- Guide definitions and nonstandard guide types such as polar grids and radial guides.
- Guide metadata that Excalidraw does not know about, such as export inclusion, snap participation, and guide-specific config.
- Group manager metadata beyond Excalidraw group IDs, such as names, export settings, library status, and animation settings.
- Project JSON wrapper that saves artboard, Excalidraw scene, files, guides, groups, templates, and animation metadata together.
- Hover highlight only if Excalidraw exposes enough pointer/scene state to do it cleanly.

## `/veditor`: Video/Sync Editor

The video editor is a later page/app.

Core responsibilities:

- Load a project created in `/editor`.
- Load a source video.
- Show a timeline or filmstrip.
- Add and edit bookmarks or keyframes.
- Map groups or objects to time ranges.
- Preview timed overlays.
- Export animated video outputs such as MP4, WebM, green-screen video, or PNG sequences, depending on browser support and transparency requirements.

This page should be deferred until the design editor basics are stable.

## Template And Library Direction

Templates and reusable assets belong after the basic editor features.

Planned capabilities:

- Save a group as a reusable design asset.
- Insert a saved group into a project.
- Save and load template galleries.
- Support different user libraries.
- Store names, categories, previews, and tags.

This should build on top of the group manager instead of being designed as a separate unrelated system.

## Cross-Platform Requirements

The app must remain browser-only and work on Mac as well as Windows.

Avoid Windows-only dependencies, local native build requirements, and backend services for core app behavior. Browser export paths should be chosen with cross-platform support in mind.

## Deferred From `vdz2`

These ideas can be revisited later but are not part of the design-editor basics:

- Video timeline inside the design editor.
- Filmstrip UI inside the design editor.
- Bookmark-based video sync inside the design editor.
- Custom Three.js selection and transform engine.
- Full WebCodecs export pipeline before static export and group animation metadata are stable.
