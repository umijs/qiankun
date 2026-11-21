import { sharedValue } from './shared-colliding.js';

const branchBLocal = window.location ? 'b' : '';

export const branchB = `${branchBLocal}:${sharedValue}`;
