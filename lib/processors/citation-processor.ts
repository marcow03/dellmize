import { TextProcessor } from '../interfaces';

export class CitationProcessor implements TextProcessor {
  process(s: string): string {
    return s.replace(/\[cite_start\]|\[cite:( |\d|,)+\]/g, '');
  }
}
