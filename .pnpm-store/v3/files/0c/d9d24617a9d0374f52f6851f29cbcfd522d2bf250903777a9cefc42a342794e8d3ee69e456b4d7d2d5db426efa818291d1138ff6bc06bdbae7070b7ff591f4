import { useEffect, useLayoutEffect } from 'react';
import canUseDom from "rc-util/es/Dom/canUseDom";

// It's safe to use `useLayoutEffect` but the warning is annoying
var useIsomorphicLayoutEffect = canUseDom() ? useLayoutEffect : useEffect;
export default useIsomorphicLayoutEffect;