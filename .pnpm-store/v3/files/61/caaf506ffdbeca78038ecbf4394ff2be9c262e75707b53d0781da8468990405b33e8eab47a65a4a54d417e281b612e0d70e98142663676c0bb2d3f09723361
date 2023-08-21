/**
 * Removed props:
 *  - childrenProps
 */
import React from 'react';
import type { AlignResult, AlignType, TargetType } from './interface';
declare type OnAlign = (source: HTMLElement, result: AlignResult) => void;
export interface AlignProps {
    align: AlignType;
    target: TargetType;
    onAlign?: OnAlign;
    monitorBufferTime?: number;
    monitorWindowResize?: boolean;
    disabled?: boolean;
    children: React.ReactElement;
}
export interface RefAlign {
    forceAlign: () => void;
}
declare const RcAlign: React.ForwardRefExoticComponent<AlignProps & React.RefAttributes<RefAlign>>;
export default RcAlign;
