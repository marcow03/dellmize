import { TextProcessor } from '../interfaces';

export class EmojisProcessor implements TextProcessor {
  process(s: string): string {
    // Regex to match emojis
    return s.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '');
  }
}
