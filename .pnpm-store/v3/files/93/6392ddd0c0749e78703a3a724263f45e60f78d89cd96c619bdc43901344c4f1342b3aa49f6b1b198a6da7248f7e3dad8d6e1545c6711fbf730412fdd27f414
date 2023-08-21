import * as React from 'react';
import type { TriggerProps } from 'rc-trigger';
import type { AnimationType, AlignType, BuildInPlacements, ActionType } from 'rc-trigger/lib/interface';
export interface DropdownProps extends Pick<TriggerProps, 'getPopupContainer' | 'children' | 'mouseEnterDelay' | 'mouseLeaveDelay' | 'onPopupAlign' | 'builtinPlacements'> {
    minOverlayWidthMatchTrigger?: boolean;
    arrow?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    onOverlayClick?: (e: Event) => void;
    prefixCls?: string;
    transitionName?: string;
    overlayClassName?: string;
    openClassName?: string;
    animation?: AnimationType;
    align?: AlignType;
    overlayStyle?: React.CSSProperties;
    placement?: string;
    placements?: BuildInPlacements;
    overlay?: (() => React.ReactElement) | React.ReactElement;
    trigger?: ActionType | ActionType[];
    alignPoint?: boolean;
    showAction?: ActionType[];
    hideAction?: ActionType[];
    visible?: boolean;
    autoFocus?: boolean;
}
declare const _default: React.ForwardRefExoticComponent<DropdownProps & React.RefAttributes<unknown>>;
export default _default;
