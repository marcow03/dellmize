import { TextProcessor } from "../interfaces";

export class DoubleSProcessor implements TextProcessor {
    process(s: string): string {
        return s.replace(/ß/g, 'ss');
    }
}