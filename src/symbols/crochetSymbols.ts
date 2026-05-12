export type CrochetSymbolCategory =
  | "basic"
  | "extended"
  | "increases"
  | "decreases"
  | "frontPost"
  | "backPost"
  | "shellsAndClusters"
  | "joining"
  | "surface";

export type CrochetSymbol = {
  id: string;
  name: string;
  nameUK: string;
  abbrUS: string;
  abbrUK: string;
  category: CrochetSymbolCategory;
  svg: string;
  defaultWidth: number;
  defaultHeight: number;
  tags: string[];
};

export const crochetSymbolCategories: Array<{
  key: CrochetSymbolCategory;
  label: string;
}> = [
  { key: "basic", label: "Basic Stitches" },
  { key: "extended", label: "Extended Stitches" },
  { key: "increases", label: "Increases" },
  { key: "decreases", label: "Decreases" },
  { key: "frontPost", label: "Front Post" },
  { key: "backPost", label: "Back Post" },
  { key: "shellsAndClusters", label: "Shells & Clusters" },
  { key: "joining", label: "Joining" },
  { key: "surface", label: "Surface" },
];

function svg(body: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

function line(x1: number, y1: number, x2: number, y2: number) {
  return `<path d="M ${x1} ${y1} L ${x2} ${y2}" />`;
}

function tWithSlashes(count: number, extended = false) {
  const stemTop = extended ? 10 : 12;
  const stemBottom = extended ? 56 : 52;
  const parts = [
    line(32, stemBottom, 32, stemTop),
    line(18, stemTop, 46, stemTop),
  ];

  if (extended) {
    parts.push(line(26, stemBottom, 38, stemBottom));
  }

  for (let i = 0; i < count; i += 1) {
    const y = stemBottom - ((stemBottom - stemTop) / (count + 1)) * (i + 1);
    parts.push(line(24, y + 5, 40, y - 5));
  }

  return svg(parts.join(""));
}

function fan(spokes: number, inverted = false) {
  const startY = inverted ? 48 : 16;
  const endY = inverted ? 16 : 48;
  const centerX = 32;
  const width = 26;
  const parts = Array.from({ length: spokes }, (_, index) => {
    const x = centerX - width / 2 + (width / Math.max(spokes - 1, 1)) * index;
    return inverted ? line(x, startY, centerX, endY) : line(centerX, endY, x, startY);
  });

  return svg(parts.join(""));
}

function postWithSlashes(count: number, dashed = false) {
  const slashes = Array.from({ length: count }, (_, index) => {
    const y = 46 - (28 / (count + 1)) * (index + 1);
    return line(25, y + 4, 39, y - 4);
  }).join("");
  const circle = `<circle cx="32" cy="50" r="6"${dashed ? ' stroke-dasharray="3 4"' : ""} />`;

  return svg(`${line(32, 50, 32, 14)}${line(20, 14, 44, 14)}${circle}${slashes}`);
}

const symbolsById: Record<string, string> = {
  ch: svg('<ellipse cx="32" cy="32" rx="17" ry="10" />'),
  sl_st: svg('<circle cx="32" cy="32" r="7" fill="currentColor" stroke="none" />'),
  sc: svg(`${line(18, 18, 46, 46)}${line(46, 18, 18, 46)}`),
  hdc: tWithSlashes(0),
  dc: tWithSlashes(1),
  tr: tWithSlashes(2),
  dtr: tWithSlashes(3),
  trtr: tWithSlashes(4),
  esc: tWithSlashes(0, true),
  ehdc: tWithSlashes(0, true),
  edc: tWithSlashes(1, true),
  etr: tWithSlashes(2, true),
  sc2in1: fan(2),
  hdc2in1: fan(2),
  dc2in1: fan(2),
  tr2in1: fan(2),
  sc3in1: fan(3),
  dc3in1: fan(3),
  sc2tog: fan(2, true),
  hdc2tog: fan(2, true),
  dc2tog: fan(2, true),
  tr2tog: fan(2, true),
  sc3tog: fan(3, true),
  dc3tog: fan(3, true),
  FPsc: postWithSlashes(0),
  FPhdc: postWithSlashes(0),
  FPdc: postWithSlashes(1),
  FPtr: postWithSlashes(2),
  FPdtr: postWithSlashes(3),
  BPsc: postWithSlashes(0, true),
  BPhdc: postWithSlashes(0, true),
  BPdc: postWithSlashes(1, true),
  BPtr: postWithSlashes(2, true),
  BPdtr: postWithSlashes(3, true),
  sh: fan(5),
  CL: svg(`${fan(3, true).match(/<svg[^>]*>(.*)<\/svg>/)?.[1] ?? ""}${line(26, 16, 38, 16)}`),
  pc: svg('<ellipse cx="32" cy="32" rx="10" ry="16" /><path d="M 24 16 L 40 16" />'),
  bo: svg('<ellipse cx="32" cy="32" rx="10" ry="15" fill="currentColor" stroke="none" />'),
  ps: svg('<ellipse cx="32" cy="32" rx="11" ry="16" />'),
  sl_st_join: svg('<rect x="24" y="24" width="16" height="16" fill="currentColor" stroke="none" />'),
  ch_sp: svg('<circle cx="32" cy="32" r="11" />'),
  FL: svg('<path d="M 22 34 A 10 10 0 0 1 42 34" /><path d="M 32 34 L 32 46" />'),
  BL: svg('<path d="M 22 30 A 10 10 0 0 0 42 30" /><path d="M 32 30 L 32 18" />'),
  picot: svg('<path d="M 32 18 L 20 44 L 44 44 Z" />'),
};

const definitions: Array<Omit<CrochetSymbol, "svg" | "defaultWidth" | "defaultHeight" | "tags">> = [
  { id: "ch", name: "Chain", nameUK: "Chain", abbrUS: "ch", abbrUK: "ch", category: "basic" },
  { id: "sl_st", name: "Slip Stitch", nameUK: "Slip Stitch", abbrUS: "sl st", abbrUK: "ss", category: "basic" },
  { id: "sc", name: "Single Crochet", nameUK: "Double Crochet", abbrUS: "sc", abbrUK: "dc", category: "basic" },
  { id: "hdc", name: "Half Double Crochet", nameUK: "Half Treble Crochet", abbrUS: "hdc", abbrUK: "htr", category: "basic" },
  { id: "dc", name: "Double Crochet", nameUK: "Treble Crochet", abbrUS: "dc", abbrUK: "tr", category: "basic" },
  { id: "tr", name: "Treble Crochet", nameUK: "Double Treble Crochet", abbrUS: "tr", abbrUK: "dtr", category: "basic" },
  { id: "dtr", name: "Double Treble Crochet", nameUK: "Triple Treble Crochet", abbrUS: "dtr", abbrUK: "trtr", category: "basic" },
  { id: "trtr", name: "Triple Treble Crochet", nameUK: "Quadruple Treble Crochet", abbrUS: "trtr", abbrUK: "qtr", category: "basic" },
  { id: "esc", name: "Extended Single Crochet", nameUK: "Extended Double Crochet", abbrUS: "esc", abbrUK: "edc", category: "extended" },
  { id: "ehdc", name: "Extended Half Double Crochet", nameUK: "Extended Half Treble Crochet", abbrUS: "ehdc", abbrUK: "ehtr", category: "extended" },
  { id: "edc", name: "Extended Double Crochet", nameUK: "Extended Treble Crochet", abbrUS: "edc", abbrUK: "etr", category: "extended" },
  { id: "etr", name: "Extended Treble Crochet", nameUK: "Extended Double Treble Crochet", abbrUS: "etr", abbrUK: "edtr", category: "extended" },
  { id: "sc2in1", name: "2 SC in 1", nameUK: "2 DC in 1", abbrUS: "2sc", abbrUK: "2dc", category: "increases" },
  { id: "hdc2in1", name: "2 HDC in 1", nameUK: "2 HTR in 1", abbrUS: "2hdc", abbrUK: "2htr", category: "increases" },
  { id: "dc2in1", name: "2 DC in 1", nameUK: "2 TR in 1", abbrUS: "2dc", abbrUK: "2tr", category: "increases" },
  { id: "tr2in1", name: "2 TR in 1", nameUK: "2 DTR in 1", abbrUS: "2tr", abbrUK: "2dtr", category: "increases" },
  { id: "sc3in1", name: "3 SC in 1", nameUK: "3 DC in 1", abbrUS: "3sc", abbrUK: "3dc", category: "increases" },
  { id: "dc3in1", name: "3 DC in 1", nameUK: "3 TR in 1", abbrUS: "3dc", abbrUK: "3tr", category: "increases" },
  { id: "sc2tog", name: "SC2tog", nameUK: "DC2tog", abbrUS: "sc2tog", abbrUK: "dc2tog", category: "decreases" },
  { id: "hdc2tog", name: "HDC2tog", nameUK: "HTR2tog", abbrUS: "hdc2tog", abbrUK: "htr2tog", category: "decreases" },
  { id: "dc2tog", name: "DC2tog", nameUK: "TR2tog", abbrUS: "dc2tog", abbrUK: "tr2tog", category: "decreases" },
  { id: "tr2tog", name: "TR2tog", nameUK: "DTR2tog", abbrUS: "tr2tog", abbrUK: "dtr2tog", category: "decreases" },
  { id: "sc3tog", name: "SC3tog", nameUK: "DC3tog", abbrUS: "sc3tog", abbrUK: "dc3tog", category: "decreases" },
  { id: "dc3tog", name: "DC3tog", nameUK: "TR3tog", abbrUS: "dc3tog", abbrUK: "tr3tog", category: "decreases" },
  { id: "FPsc", name: "Front Post SC", nameUK: "Front Post DC", abbrUS: "FPsc", abbrUK: "FPdc", category: "frontPost" },
  { id: "FPhdc", name: "Front Post HDC", nameUK: "Front Post HTR", abbrUS: "FPhdc", abbrUK: "FPhtr", category: "frontPost" },
  { id: "FPdc", name: "Front Post DC", nameUK: "Front Post TR", abbrUS: "FPdc", abbrUK: "FPtr", category: "frontPost" },
  { id: "FPtr", name: "Front Post TR", nameUK: "Front Post DTR", abbrUS: "FPtr", abbrUK: "FPdtr", category: "frontPost" },
  { id: "FPdtr", name: "Front Post DTR", nameUK: "Front Post TTR", abbrUS: "FPdtr", abbrUK: "FPttr", category: "frontPost" },
  { id: "BPsc", name: "Back Post SC", nameUK: "Back Post DC", abbrUS: "BPsc", abbrUK: "BPdc", category: "backPost" },
  { id: "BPhdc", name: "Back Post HDC", nameUK: "Back Post HTR", abbrUS: "BPhdc", abbrUK: "BPhtr", category: "backPost" },
  { id: "BPdc", name: "Back Post DC", nameUK: "Back Post TR", abbrUS: "BPdc", abbrUK: "BPtr", category: "backPost" },
  { id: "BPtr", name: "Back Post TR", nameUK: "Back Post DTR", abbrUS: "BPtr", abbrUK: "BPdtr", category: "backPost" },
  { id: "BPdtr", name: "Back Post DTR", nameUK: "Back Post TTR", abbrUS: "BPdtr", abbrUK: "BPttr", category: "backPost" },
  { id: "sh", name: "Shell", nameUK: "Shell", abbrUS: "sh", abbrUK: "sh", category: "shellsAndClusters" },
  { id: "CL", name: "Cluster", nameUK: "Cluster", abbrUS: "CL", abbrUK: "CL", category: "shellsAndClusters" },
  { id: "pc", name: "Popcorn", nameUK: "Popcorn", abbrUS: "pc", abbrUK: "pc", category: "shellsAndClusters" },
  { id: "bo", name: "Bobble", nameUK: "Bobble", abbrUS: "bo", abbrUK: "bo", category: "shellsAndClusters" },
  { id: "ps", name: "Puff Stitch", nameUK: "Puff Stitch", abbrUS: "ps", abbrUK: "ps", category: "shellsAndClusters" },
  { id: "sl_st_join", name: "Slip Stitch Join", nameUK: "Slip Stitch Join", abbrUS: "sl st join", abbrUK: "ss join", category: "joining" },
  { id: "ch_sp", name: "Chain Space", nameUK: "Chain Space", abbrUS: "ch-sp", abbrUK: "ch-sp", category: "joining" },
  { id: "FL", name: "Front Loop Only", nameUK: "Front Loop Only", abbrUS: "FLO", abbrUK: "FLO", category: "surface" },
  { id: "BL", name: "Back Loop Only", nameUK: "Back Loop Only", abbrUS: "BLO", abbrUK: "BLO", category: "surface" },
  { id: "picot", name: "Picot", nameUK: "Picot", abbrUS: "picot", abbrUK: "picot", category: "surface" },
];

export const crochetSymbols: CrochetSymbol[] = definitions.map((definition) => ({
  ...definition,
  svg: symbolsById[definition.id],
  defaultWidth: 64,
  defaultHeight: 64,
  tags: [
    definition.id,
    definition.abbrUS,
    definition.abbrUK,
    definition.name.toLowerCase(),
    definition.nameUK.toLowerCase(),
  ],
}));
