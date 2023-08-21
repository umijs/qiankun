# Changes to PostCSS Is Pseudo Class

### 2.0.7 (July 8, 2022)

- Fix case insensitive matching.

### 2.0.6 (June 23, 2022)

- Fix selector order with any pseudo element.
- Fix transforming pseudo elements in `:is()`. Following the specification pseudo elements are invalid and we now transform to a known invalid pseudo element.
- Add `onPseudoElement` plugin option. Set `{ onPseudoElement: 'warning' }` to receive warnings when this plugin encounters an unprocessable pseudo element.

### 2.0.5 (June 4, 2022)

- Update `@csstools/selector-specificity` (major)

### 2.0.4 (May 17, 2022)

- Fix selector order with `:before` and other pseudo elements.

### 2.0.3 (May 11, 2022)

- Use `@csstools/selector-specificity` for specificity calculations.

### 2.0.2 (April 4, 2022)

- Improved : compound selector order with pseudo elements
- Improved : selector specificity calculation.

### 2.0.1 (March 4, 2022)

- Preserve selector order as much as possible. Fixes issues where pseudo elements `::before` were moved.

### 2.0.0 (January 31, 2022)

- Remove `skip` flag in `onComplexSelectors` option.

If a complex selector is encountered that has no known equivalent, it will always be skipped and preserved now.

The previous behavior was to remove `:is()` even if that broke the selector.

### 1.0.1 (January 17, 2022)

- Fix selector order

### 1.0.0 (January 13, 2022)

- initial release
