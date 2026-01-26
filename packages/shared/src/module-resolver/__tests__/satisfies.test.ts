import { describe, expect, it } from 'vitest';
import { satisfies } from '../satisfies';

describe('satisfies wrapper', () => {
  describe('full wildcards', () => {
    it('should match * wildcard', () => {
      expect(satisfies('1.2.3', '*')).toBe(true);
      expect(satisfies('0.0.1', '*')).toBe(true);
    });

    it('should match x wildcard', () => {
      expect(satisfies('1.2.3', 'x')).toBe(true);
      expect(satisfies('1.2.3', 'X')).toBe(true);
    });
  });

  describe('short wildcards (N.x format)', () => {
    it('should match major.x format', () => {
      expect(satisfies('1.0.0', '1.x')).toBe(true);
      expect(satisfies('1.2.3', '1.x')).toBe(true);
      expect(satisfies('1.99.99', '1.x')).toBe(true);
    });

    it('should not match different major version', () => {
      expect(satisfies('0.9.9', '1.x')).toBe(false);
      expect(satisfies('2.0.0', '1.x')).toBe(false);
    });

    it('should handle * and X variants', () => {
      expect(satisfies('1.2.3', '1.*')).toBe(true);
      expect(satisfies('1.2.3', '1.X')).toBe(true);
      expect(satisfies('2.0.0', '1.*')).toBe(false);
    });
  });

  describe('standard ranges (passthrough)', () => {
    it('should handle caret ranges', () => {
      expect(satisfies('1.2.3', '^1.0.0')).toBe(true);
      expect(satisfies('2.0.0', '^1.0.0')).toBe(false);
    });

    it('should handle tilde ranges', () => {
      expect(satisfies('1.2.5', '~1.2.0')).toBe(true);
      expect(satisfies('1.3.0', '~1.2.0')).toBe(false);
    });

    it('should handle full wildcards with segments', () => {
      expect(satisfies('1.2.3', '1.2.x')).toBe(true);
      expect(satisfies('1.2.3', '1.x.x')).toBe(true);
      expect(satisfies('1.2.3', '1.2.*')).toBe(true);
    });
  });

  describe('prerelease versions (semver-compatible)', () => {
    it('should not match prerelease when range has no prerelease', () => {
      expect(satisfies('1.0.0-alpha', '^1.0.0')).toBe(false);
      expect(satisfies('1.0.1-beta.1', '^1.0.0')).toBe(false);
      expect(satisfies('1.1.0-rc.1', '~1.0.0')).toBe(false);
    });

    it('should match prerelease when range includes prerelease', () => {
      expect(satisfies('1.0.0-alpha', '1.0.0-alpha')).toBe(true);
      expect(satisfies('1.0.0-alpha', '>=1.0.0-alpha')).toBe(true);
    });

    it('should handle normal versions correctly', () => {
      expect(satisfies('1.0.0', '^1.0.0')).toBe(true);
      expect(satisfies('1.2.3', '^1.0.0')).toBe(true);
    });
  });
});
