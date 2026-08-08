declare const __DEV__: boolean;
// Upstream also declared `process` here for its BABEL_ENV probe; this monorepo compiles with
// @types/node, whose `process` global covers that access and conflicts with a redeclaration.
declare const __PROFILE__: boolean;
