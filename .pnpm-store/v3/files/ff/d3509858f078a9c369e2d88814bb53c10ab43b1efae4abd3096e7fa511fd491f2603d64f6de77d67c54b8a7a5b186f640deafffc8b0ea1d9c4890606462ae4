import * as React from 'react';
import TabPane from './TabPanelList/TabPane';
import type { TabPosition, RenderTabBar, TabsLocale, EditableConfig, AnimatedConfig, OnTabScroll, TabBarExtraContent } from './interface';
export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    prefixCls?: string;
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    id?: string;
    activeKey?: string;
    defaultActiveKey?: string;
    direction?: 'ltr' | 'rtl';
    animated?: boolean | AnimatedConfig;
    renderTabBar?: RenderTabBar;
    tabBarExtraContent?: TabBarExtraContent;
    tabBarGutter?: number;
    tabBarStyle?: React.CSSProperties;
    tabPosition?: TabPosition;
    destroyInactiveTabPane?: boolean;
    onChange?: (activeKey: string) => void;
    onTabClick?: (activeKey: string, e: React.KeyboardEvent | React.MouseEvent) => void;
    onTabScroll?: OnTabScroll;
    editable?: EditableConfig;
    getPopupContainer?: (node: HTMLElement) => HTMLElement;
    locale?: TabsLocale;
    moreIcon?: React.ReactNode;
    /** @private Internal usage. Not promise will rename in future */
    moreTransitionName?: string;
    popupClassName?: string;
}
declare const ForwardTabs: React.ForwardRefExoticComponent<TabsProps & React.RefAttributes<HTMLDivElement>>;
export declare type ForwardTabsType = typeof ForwardTabs & {
    TabPane: typeof TabPane;
};
declare const _default: ForwardTabsType;
export default _default;
