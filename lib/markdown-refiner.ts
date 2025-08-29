import { Refiner, TextExporter, TextProcessor } from './interfaces';

export class MarkdownRefiner implements Refiner {
  private processors: TextProcessor[] = [];
  private exporter: TextExporter | null = null;

  addProcessor(p: TextProcessor): Refiner {
    this.processors.push(p);
    return this;
  }

  setExporter(e: TextExporter): Refiner {
    this.exporter = e;
    return this;
  }

  getExporter(): TextExporter {
    if (!this.exporter) {
      throw new Error('Exporter not set');
    }
    return this.exporter;
  }

  refine(s: string): string {
    let result = s;
    for (const processor of this.processors) {
      result = processor.process(result);
    }
    if (this.exporter) {
      result = this.exporter.export(result);
    }
    return result;
  }
}
