import { KeyCode } from '../common/event_util';
import { AudioRenderer } from './audio_renderer';
import { AuditoryDescription } from './auditory_description';
import { Span } from './span';
export declare abstract class AbstractAudioRenderer implements AudioRenderer {
    private separator_;
    abstract markup(descrs: AuditoryDescription[]): string;
    setSeparator(sep: string): void;
    getSeparator(): string;
    error(_key: KeyCode | string): string | null;
    merge(spans: Span[]): string;
    finalize(str: string): string;
    pauseValue(value: string): number;
}
