import * as EngineConst from '../common/engine_const';
import { AuditoryDescription } from './auditory_description';
export interface Tags {
    open?: EngineConst.personalityProps[];
    close?: EngineConst.personalityProps[];
    [personality: string]: any;
}
export declare type PauseValue = number | string;
export interface Pause {
    pause: PauseValue;
    [personality: string]: any;
}
export declare type Markup = Pause | Tags;
export declare function mergePause(oldPause: Pause | null, newPause: Pause, opt_merge?: (p1: PauseValue, p2: PauseValue) => PauseValue): Pause;
export declare function mergeMarkup(oldPers: Tags, newPers: Tags): void;
export declare function sortClose(open: EngineConst.personalityProps[], descrs: Tags[]): EngineConst.personalityProps[];
export declare function personalityMarkup(descrs: AuditoryDescription[]): Markup[];
export declare function isMarkupElement(element: Markup): boolean;
export declare function isPauseElement(element: Markup): boolean;
export declare function isSpanElement(element: Markup): boolean;
