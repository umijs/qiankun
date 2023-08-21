# properties-alphabetical-order

Specify the alphabetical order of properties within declaration blocks.

```css
a {
	color: pink;
	top: 0;
}
/** ↑
 * These properties */
```

Prefixed properties *must always* precede the unprefixed version.

This rule ignores variables (`$sass`, `@less`, `--custom-property`).

## Options

### `true`

The following patterns are considered warnings:

```css
a {
	top: 0;
	color: pink;
}
```

```css
a {
	-moz-transform: scale(1);
	transform: scale(1);
	-webkit-transform: scale(1);
}
```

The following patterns are *not* considered warnings:

```css
a {
	color: pink;
	top: 0;
}
```

```css
a {
	-webkit-transform: scale(1);
	-moz-transform: scale(1);
	transform: scale(1);
}
```

```css
a {
	-moz-transform: scale(1);
	-webkit-transform: scale(1);
	transform: scale(1);
}
```

## Optional secondary options

### `disableFix: true`

Disable autofixing. Autofixing is enabled by default if it's enabled in stylelint configuration.
