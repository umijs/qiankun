// Local `history` collides with the sandbox destructuring, so probeModule() must
// rebuild this module and revoke its provisional blob URL.
const history = { marker: 'local-history' };
window.__SHARED_COLLISION_HISTORY__ = history.marker;
export const v = 42;
