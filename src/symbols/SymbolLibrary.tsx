import { useMemo, useState } from "react";
import { insertCrochetSymbol } from "../editor/symbolInsertion";
import { crochetSymbolCategories, crochetSymbols } from "./crochetSymbols";

export function SymbolLibrary() {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const visibleSymbols = useMemo(
    () =>
      crochetSymbols.filter((symbol) => {
        if (!normalizedQuery) {
          return true;
        }

        return symbol.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
      }),
    [normalizedQuery],
  );

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Elements</h2>
          <p className="text-xs font-medium text-slate-500">Crochet symbols</p>
        </div>
        <label className="block">
          <span className="sr-only">Search symbols</span>
          <input
            className="h-10 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-2 focus:ring-teal-100"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search symbols"
            type="search"
            value={query}
          />
        </label>
      </div>

      {crochetSymbolCategories.map((category) => {
        const symbols = visibleSymbols.filter((symbol) => symbol.category === category.key);

        if (symbols.length === 0) {
          return null;
        }

        return (
          <section className="space-y-2" key={category.key}>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {category.label}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {symbols.map((symbol) => (
                <button
                  aria-label={symbol.name}
                  className="group flex min-h-24 flex-col items-center justify-between rounded-md border border-slate-200 bg-white p-2 text-center text-slate-800 transition hover:border-teal-500 hover:bg-teal-50"
                  key={symbol.id}
                  onClick={() => insertCrochetSymbol(symbol)}
                  title={`${symbol.name} / ${symbol.nameUK}`}
                  type="button"
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center text-slate-800 transition group-hover:text-teal-800 [&_svg]:h-10 [&_svg]:w-10"
                    dangerouslySetInnerHTML={{ __html: symbol.svg }}
                  />
                  <span className="mt-2 text-xs font-semibold">{symbol.abbrUS}</span>
                  <span className="text-[11px] leading-tight text-slate-500">{symbol.name}</span>
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
