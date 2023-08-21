import * as React from 'react';
import type { Tab, EditableConfig } from '../interface';
export interface TabNodeProps {
    id: string;
    prefixCls: string;
    tab: Tab;
    active: boolean;
    closable?: boolean;
    editable?: EditableConfig;
    onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
    onResize?: (width: number, height: number, left: number, top: number) => void;
    renderWrapper?: (node: React.ReactElement) => React.ReactElement;
    removeAriaLabel?: string;
    removeIcon?: React.ReactNode;
    onRemove: () => void;
    onFocus: React.FocusEventHandler;
    style?: React.CSSProperties;
}
declare const _default: React.ForwardRefExoticComponent<TabNodeProps & React.RefAttributes<HTMLDivElement>>;
export default _default;
