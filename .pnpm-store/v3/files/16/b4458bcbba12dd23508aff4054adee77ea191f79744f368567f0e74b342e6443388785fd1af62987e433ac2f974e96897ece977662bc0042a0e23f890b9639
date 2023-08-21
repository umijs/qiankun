import expect from 'expect';
import { elementType } from 'jsx-ast-utils';
import isFocusable from '../../../src/util/isFocusable';
import {
  genElementSymbol,
  genInteractiveElements,
  genNonInteractiveElements,
} from '../../../__mocks__/genInteractives';
import JSXAttributeMock from '../../../__mocks__/JSXAttributeMock';

function mergeTabIndex(index, attributes) {
  return [...attributes, JSXAttributeMock('tabIndex', index)];
}

describe('isFocusable', () => {
  describe('interactive elements', () => {
    genInteractiveElements().forEach(({ openingElement }) => {
      it(`should identify \`${genElementSymbol(openingElement)}\` as a focusable element`, () => {
        expect(isFocusable(
          elementType(openingElement),
          openingElement.attributes,
        )).toBe(true);
      });

      it(`should not identify \`${genElementSymbol(openingElement)}\` with tabIndex of -1 as a focusable element`, () => {
        expect(isFocusable(
          elementType(openingElement),
          mergeTabIndex(-1, openingElement.attributes),
        )).toBe(false);
      });

      it(`should identify \`${genElementSymbol(openingElement)}\` with tabIndex of 0 as a focusable element`, () => {
        expect(isFocusable(
          elementType(openingElement),
          mergeTabIndex(0, openingElement.attributes),
        )).toBe(true);
      });

      it(`should identify \`${genElementSymbol(openingElement)}\` with tabIndex of 1 as a focusable element`, () => {
        expect(isFocusable(
          elementType(openingElement),
          mergeTabIndex(1, openingElement.attributes),
        )).toBe(true);
      });
    });
  });

  describe('non-interactive elements', () => {
    genNonInteractiveElements().forEach(({ openingElement }) => {
      it(`should not identify \`${genElementSymbol(openingElement)}\` as a focusable element`, () => {
        expect(isFocusable(
          elementType(openingElement),
          openingElement.attributes,
        )).toBe(false);
      });

      it(`should not identify \`${genElementSymbol(openingElement)}\` with tabIndex of -1 as a focusable element`, () => {
        expect(isFocusable(
          elementType(openingElement),
          mergeTabIndex(-1, openingElement.attributes),
        )).toBe(false);
      });

      it(`should identify \`${genElementSymbol(openingElement)}\` with tabIndex of 0 as a focusable element`, () => {
        expect(isFocusable(
          elementType(openingElement),
          mergeTabIndex(0, openingElement.attributes),
        )).toBe(true);
      });

      it(`should identify \`${genElementSymbol(openingElement)}\` with tabIndex of 1 as a focusable element`, () => {
        expect(isFocusable(
          elementType(openingElement),
          mergeTabIndex(1, openingElement.attributes),
        )).toBe(true);
      });

      it(`should not identify \`${genElementSymbol(openingElement)}\` with tabIndex of 'bogus' as a focusable element`, () => {
        expect(isFocusable(
          elementType(openingElement),
          mergeTabIndex('bogus', openingElement.attributes),
        )).toBe(false);
      });
    });
  });
});
