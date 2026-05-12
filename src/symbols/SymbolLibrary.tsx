import { crochetSymbolCategories, crochetSymbols } from "./crochetSymbols";

export function SymbolLibrary() {
  return (
    <div className="space-y-5 p-4">
      <div>
        <h2 className="text-sm font-semibold text-slate-900">Symbols</h2>
        <p className="mt-1 text-xs text-slate-500">
          Ported from the previous stitch library. Insertion comes next.
        </p>
      </div>

      {crochetSymbolCategories.map((category) => {
        const symbols = crochetSymbols.filter((symbol) => symbol.category === category.key);

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
