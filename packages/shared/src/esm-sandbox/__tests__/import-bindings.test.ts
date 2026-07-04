import { describe, expect, it } from 'vitest';
import { parseImportBindings } from '../import-bindings';

describe('parseImportBindings', () => {
  it('parses default imports', () => {
    expect(parseImportBindings(`import App from './App.vue';`)).toEqual(['App']);
  });

  it('parses named imports with alias', () => {
    expect(parseImportBindings(`import { createApp, ref as reactiveRef } from 'vue';`)).toEqual([
      'createApp',
      'reactiveRef',
    ]);
  });

  it('parses namespace imports', () => {
    expect(parseImportBindings(`import * as utils from './utils';`)).toEqual(['utils']);
  });

  it('parses mixed default and named imports', () => {
    expect(parseImportBindings(`import React, { useState, useEffect } from 'react';`)).toEqual([
      'React',
      'useState',
      'useEffect',
    ]);
  });

  it('parses string import names', () => {
    expect(parseImportBindings(`import { "a-b" as location } from './names.js';`)).toEqual(['location']);
  });

  it('returns nothing for side-effect imports', () => {
    expect(parseImportBindings(`import './style.css';`)).toEqual([]);
  });

  it('returns nothing for re-exports', () => {
    expect(parseImportBindings(`export { history } from './router';`)).toEqual([]);
    expect(parseImportBindings(`export * from './router';`)).toEqual([]);
  });

  it('parses default import of `default as` form', () => {
    expect(parseImportBindings(`import { default as history } from './history.js';`)).toEqual(['history']);
  });

  it('ignores global names inside comments so they are not wrongly excluded (escape guard)', () => {
    // `window` here is only mentioned in a comment; it must NOT be treated as a binding, otherwise it
    // would be dropped from the destructuring set and a real `window` reference would escape the sandbox
    expect(parseImportBindings(`import { foo } /* window */ from './x';`)).toEqual(['foo']);
    expect(parseImportBindings(`import /* document */ Foo from './x';`)).toEqual(['Foo']);
  });

  it('does not treat a // inside a specifier URL as a comment', () => {
    expect(parseImportBindings(`import App from 'https://cdn.example.com/App.js';`)).toEqual(['App']);
  });
});
