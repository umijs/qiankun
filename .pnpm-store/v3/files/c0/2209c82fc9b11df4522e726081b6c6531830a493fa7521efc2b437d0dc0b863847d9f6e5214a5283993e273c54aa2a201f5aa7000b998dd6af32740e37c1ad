import { AbstractAudioRenderer } from './abstract_audio_renderer';
import { Pause } from './audio_util';
export declare abstract class MarkupRenderer extends AbstractAudioRenderer {
    protected ignoreElements: string[];
    private scaleFunction;
    abstract pause(pause: Pause): void;
    abstract prosodyElement(key: string, value: number): void;
    setScaleFunction(a: number, b: number, c: number, d: number, decimals?: number): void;
    applyScaleFunction(value: number): number;
    protected ignoreElement(key: string): boolean;
}
