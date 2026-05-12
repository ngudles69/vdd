const tools = ["Templates", "Symbols", "Guides", "Shapes", "Text", "Groups", "Export"];

export function LeftToolbar() {
  return (
    <aside className="flex min-h-0 flex-col items-center gap-2 border-r border-slate-200 bg-white px-2 py-3">
      {tools.map((tool) => (
        <button
          className="flex h-12 w-full items-center justify-center rounded-md text-[11px] font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          key={tool}
          type="button"
        >
          {tool}
        </button>
      ))}
    </aside>
  );
}
