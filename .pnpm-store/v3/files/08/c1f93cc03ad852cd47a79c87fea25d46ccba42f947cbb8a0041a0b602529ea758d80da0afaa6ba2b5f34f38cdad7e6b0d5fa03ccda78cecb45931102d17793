import * as React from 'react';
import type { MenuMode } from '../interface';
export default function useAccessibility<T extends HTMLElement>(mode: MenuMode, activeKey: string, isRtl: boolean, id: string, containerRef: React.RefObject<HTMLUListElement>, getKeys: () => string[], getKeyPath: (key: string, includeOverflow?: boolean) => string[], triggerActiveKey: (key: string) => void, triggerAccessibilityOpen: (key: string, open?: boolean) => void, originOnKeyDown?: React.KeyboardEventHandler<T>): React.KeyboardEventHandler<T>;
