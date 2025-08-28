import { TextProcessor } from "../interfaces";

export class MarkdownBoldProcessor implements TextProcessor {
    process(s: string): string {
        return s.replace(/\*\*(.*?)\*\*/g, '$1');
    }
}