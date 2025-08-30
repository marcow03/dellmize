import { TextExporter } from './interfaces';
import { initPandoc } from './pandoc';

export class PandocExporter implements TextExporter {
  private inputFormat: string = 'markdown';
  private outputFormat: string = 'markdown';
  private pandoc: ((args: string, input: string) => string) | null = null;

  async initialize() {
    this.pandoc = await initPandoc();
  }

  setOutputFormat(format: string) {
    this.outputFormat = format;
  }

  export(s: string): string {
    if (this.inputFormat === this.outputFormat) return s;

    return this.pandoc!(`-f ${this.inputFormat} -t ${this.outputFormat}`, s);
  }
}
