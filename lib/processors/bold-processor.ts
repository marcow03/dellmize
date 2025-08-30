import { TextProcessor } from '../interfaces';

export class BoldProcessor implements TextProcessor {
  process(s: string): string {
    return s.replace(/\*\*(.*?)\*\*/g, '$1');
  }
}
