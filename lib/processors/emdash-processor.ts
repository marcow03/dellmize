import { TextProcessor } from '../interfaces';

export class EmDashProcessor implements TextProcessor {
  process(s: string): string {
    return s
      .replace(/ — /g, ', ')
      .replace(/ – /g, ', ')
      .trim();
  }
}
