import expect from 'expect';
import isContentEditable from '../../../src/util/isContentEditable';
import JSXAttributeMock from '../../../__mocks__/JSXAttributeMock';

describe('isContentEditable', () => {
  describe('HTML5', () => {
    describe('content editable', () => {
      it('should identify HTML5 contentEditable elements', () => {
        const attributes = [
          JSXAttributeMock('contentEditable', 'true'),
        ];
        expect(isContentEditable('some tag', attributes))
          .toBe(true);
      });
    });

    describe('not content editable', () => {
      it('should not identify HTML5 content editable elements with null as the value', () => {
        const attributes = [
          JSXAttributeMock('contentEditable', null),
        ];
        expect(isContentEditable('some tag', attributes))
          .toBe(false);
      });

      it('should not identify HTML5 content editable elements with undefined as the value', () => {
        const attributes = [
          JSXAttributeMock('contentEditable', undefined),
        ];
        expect(isContentEditable('some tag', attributes))
          .toBe(false);
      });

      it('should not identify HTML5 content editable elements with true as the value', () => {
        const attributes = [
          JSXAttributeMock('contentEditable', true),
        ];
        expect(isContentEditable('some tag', attributes))
          .toBe(false);
      });

      it('should not identify HTML5 content editable elements with "false" as the value', () => {
        const attributes = [
          JSXAttributeMock('contentEditable', 'false'),
        ];
        expect(isContentEditable('some tag', attributes))
          .toBe(false);
      });
    });
  });
});
