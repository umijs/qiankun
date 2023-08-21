# Changes to PostCSS OKLab Function

### 1.1.1 (July 8, 2022)

- Fix case insensitive matching.

### 1.1.0 (April 4, 2022)

- Allow percentage and number units in more color components.

```css
.percentages {
	color-1: oklab(40% 0.309% 0.975%);
	color-2: oklch(40% 31.718385875% 34.568626);

	/* becomes */

	color-1: rgb(73, 71, 69);
	color-1: color(display-p3 0.28515 0.27983 0.27246);
	color-2: rgb(126, 37, 15);
	color-2: color(display-p3 0.45368 0.16978 0.09411);
}

.numbers {
	color-1: oklab(0.40 0.001236 0.0039);
	color-2: oklch(0.40 0.1268735435 34.568626);

	/* becomes */

	color-1: rgb(73, 71, 69);
	color-1: color(display-p3 0.28515 0.27983 0.27246);
	color-2: rgb(126, 37, 15);
	color-2: color(display-p3 0.45368 0.16978 0.09411);
}
```

### 1.0.2 (March 8, 2022)

- Fix gamut mapping giving overly unsaturated colors.
- Implement powerless color components in gamut mapping.

### 1.0.1 (February 12, 2022)

- Updated `@csstools/postcss-progressive-custom-properties` to `1.1.0`.

### 1.0.0 (February 11, 2022)

- Initial version
