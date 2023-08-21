/// <reference types="react" />
import type { TabNavListProps } from './TabNavList';
import type { TabPaneProps } from './TabPanelList/TabPane';
export declare type TabSizeMap = Map<React.Key, {
    width: number;
    height: number;
    left: number;
    top: number;
}>;
export interface TabOffset {
    width: number;
    height: number;
    left: number;
    right: number;
    top: number;
}
export declare type TabOffsetMap = Map<React.Key, TabOffset>;
export declare type TabPosition = 'left' | 'right' | 'top' | 'bottom';
export interface Tab extends TabPaneProps {
    key: string;
    node: React.ReactElement;
}
declare type RenderTabBarProps = {
    id: string;
    activeKey: string;
    animated: AnimatedConfig;
    tabPosition: TabPosition;
    rtl: boolean;
    mobile: boolean;
    editable: EditableConfig;
    locale: TabsLocale;
    moreIcon: React.ReactNode;
    moreTransitionName: string;
    tabBarGutter: number;
    onTabClick: (key: string, e: React.MouseEvent | React.KeyboardEvent) => void;
    onTabScroll: OnTabScroll;
    extra: TabBarExtraContent;
    style: React.CSSProperties;
    panes: React.ReactNode;
};
export declare type RenderTabBar = (props: RenderTabBarProps, DefaultTabBar: React.ComponentType<TabNavListProps>) => React.ReactElement;
export interface TabsLocale {
    dropdownAriaLabel?: string;
    removeAriaLabel?: string;
    addAriaLabel?: string;
}
export interface EditableConfig {
    onEdit: (type: 'add' | 'remove', info: {
        key?: string;
        event: React.MouseEvent | React.KeyboardEvent;
    }) => void;
    showAdd?: boolean;
    removeIcon?: React.ReactNode;
    addIcon?: React.ReactNode;
}
export interface AnimatedConfig {
    inkBar?: boolean;
    tabPane?: boolean;
}
export declare type OnTabScroll = (info: {
    direction: 'left' | 'right' | 'top' | 'bottom';
}) => void;
export declare type TabBarExtraPosition = 'left' | 'right';
export declare type TabBarExtraMap = Partial<Record<TabBarExtraPosition, React.ReactNode>>;
export declare type TabBarExtraContent = React.ReactNode | TabBarExtraMap;
export {};
