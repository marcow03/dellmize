export interface TextProcessor {
  process(s: string): string;
}

export interface Refiner {
  addProcessor(p: TextProcessor): Refiner;
  setExporter(e: TextExporter): Refiner;
  getExporter(): TextExporter;
  refine(s: string): string;
}

export interface TextExporter {
  export(s: string): string;
  setOutputFormat(format: string): void;
}
