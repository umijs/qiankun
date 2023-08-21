import * as React from 'react';
import type { TabPosition, RenderTabBar, TabsLocale, EditableConfig, AnimatedConfig, OnTabScroll, TabBarExtraContent } from '../interface';
export interface TabNavListProps {
    id: string;
    tabPosition: TabPosition;
    activeKey: string;
    rtl: boolean;
    panes: React.ReactNode;
    animated?: AnimatedConfig;
    extra?: TabBarExtraContent;
    editable?: EditableConfig;
    moreIcon?: React.ReactNode;
    moreTransitionName?: string;
    mobile: boolean;
    tabBarGutter?: number;
    renderTabBar?: RenderTabBar;
    className?: string;
    style?: React.CSSProperties;
    locale?: TabsLocale;
    onTabClick: (activeKey: string, e: React.MouseEvent | React.KeyboardEvent) => void;
    onTabScroll?: OnTabScroll;
    children?: (node: React.ReactElement) => React.ReactElement;
    getPopupContainer?: (node: HTMLElement) => HTMLElement;
    popupClassName?: string;
}
declare const _default: React.ForwardRefExoticComponent<TabNavListProps & React.RefAttributes<HTMLDivElement>>;
export default _default;
