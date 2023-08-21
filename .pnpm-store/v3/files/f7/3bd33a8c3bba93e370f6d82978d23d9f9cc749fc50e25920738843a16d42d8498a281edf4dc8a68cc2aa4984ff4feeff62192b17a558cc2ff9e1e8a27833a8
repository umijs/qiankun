# Changes to PostCSS Color Function

### 1.1.1 (July 8, 2022)

- Fix case insensitive matching.

### 1.1.0 (April 4, 2022)

- Allow percentage units in XYZ color spaces.

```css
.percentages {
	color-1: color(xyz-d50 64.331% 19.245% 16.771%);
	color-2: color(xyz-d65 64.331% 19.245% 16.771%);
	color-3: color(xyz 64.331% 19.245% 16.771%);

	/* becomes */

	color-1: rgb(245,0,135);
	color-2: rgb(253,0,127);
	color-3: rgb(253,0,127);
}
```

### 1.0.3 (March 8, 2022)

- Fix gamut mapping giving overly unsaturated colors.
- Implement powerless color components in gamut mapping.

### 1.0.2 (February 12, 2022)

- Updated `@csstools/postcss-progressive-custom-properties` to `1.1.0`.

### 1.0.1 (February 11, 2022)

- Add tests for percentage values in non-xyz color spaces.
- Ignore percentage values in xyz color space as these are not supported.

### 1.0.0 (February 7, 2022)

- Initial version
