import { TextProcessor } from '../interfaces';

export class HorizontalRulesProcessor implements TextProcessor {
  process(s: string): string {
    return s.replace(/---/g, '');
  }
}
