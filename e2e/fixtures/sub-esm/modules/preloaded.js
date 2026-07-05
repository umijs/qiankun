// Dedicated to the modulepreload e2e case: no other fixture graph imports this file,
// so its server request count stays isolated from tests running in parallel workers.
export const marker = 'on';
