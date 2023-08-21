import * as React from 'react';
import type { CSSMotionProps } from 'rc-motion';
import type { Point, AlignType, StretchType, TransitionNameType, AnimationType } from '../interface';
export interface PopupInnerProps {
    visible?: boolean;
    prefixCls: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    zIndex?: number;
    motion: CSSMotionProps;
    destroyPopupOnHide?: boolean;
    forceRender?: boolean;
    animation: AnimationType;
    transitionName: TransitionNameType;
    stretch?: StretchType;
    align?: AlignType;
    point?: Point;
    getRootDomNode?: () => HTMLElement;
    getClassNameFromAlign?: (align: AlignType) => string;
    onAlign?: (element: HTMLElement, align: AlignType) => void;
    onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
    onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
    onTouchStart?: React.TouchEventHandler<HTMLDivElement>;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}
export interface PopupInnerRef {
    forceAlign: () => void;
    getElement: () => HTMLElement;
}
declare const PopupInner: React.ForwardRefExoticComponent<PopupInnerProps & React.RefAttributes<PopupInnerRef>>;
export default PopupInner;
