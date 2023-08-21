import { KeyCode } from '../common/event_util';
import { AuditoryDescription } from './auditory_description';
import { Span } from './span';
export interface AudioRenderer {
    setSeparator(sep: string): void;
    getSeparator(): string;
    markup(descrs: AuditoryDescription[]): string;
    error(key: KeyCode | string): string | null;
    merge(strs: Span[]): string;
    finalize(str: string): string;
}
