import { TextProcessor } from "../interfaces";

export class ItalicProcessor implements TextProcessor {
    process(s: string): string {
        return s.replace(/(?<!^)(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)/gm, '$1');
    }
}