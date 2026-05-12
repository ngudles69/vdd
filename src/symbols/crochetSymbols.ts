export type CrochetSymbol = {
  id: string;
  name: string;
  category: string;
  svg: string;
  defaultWidth: number;
  defaultHeight: number;
  tags: string[];
};

export const crochetSymbols: CrochetSymbol[] = [];
