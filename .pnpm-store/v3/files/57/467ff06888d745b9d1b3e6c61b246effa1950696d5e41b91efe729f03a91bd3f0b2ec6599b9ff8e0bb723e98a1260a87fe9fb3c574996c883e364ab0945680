/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

/**
 * The names of the known browsers.
 */
export type BrowserNames =
  | 'chrome'
  | 'chrome_android'
  | 'edge'
  | 'firefox'
  | 'firefox_android'
  | 'ie'
  | 'nodejs'
  | 'opera'
  | 'opera_android'
  | 'safari'
  | 'safari_ios'
  | 'samsunginternet_android'
  | 'webview_android';

export type BrowserEngines =
  | 'Blink'
  | 'EdgeHTML'
  | 'Gecko'
  | 'Presto'
  | 'Trident'
  | 'WebKit'
  | 'V8';

/**
 * The browser namespace.
 */
export interface Browsers
  extends Record<BrowserNames, BrowserStatement>,
    Record<string, BrowserStatement> {}

/**
 * A browser statement.
 */
export interface BrowserStatement {
  /**
   * The browser brand name, for example:
   * `"Firefox"`, `"Firefox Android"`, `"Safari"`, `"iOS Safari"`, etc.
   */
  name: string;

  /**
   * The known versions of this browser.
   */
  releases: {
    [version: string]: ReleaseStatement;
  };

  /**
   * An optional string containing the URL of the page where feature flags can be changed
   * (e.g. `"about:config"` for Firefox or `"chrome://flags"` for Chrome).
   */
  pref_url?: string;
}

/**
 * The data about this version.
 */
export interface ReleaseStatement {
  /**
   * The date on which this version was released.
   *
   * Formatted as `YYYY-MM-DD`.
   */
  release_date?: string;

  /**
   * The URL of the release notes.
   */
  release_notes?: string;

  /**
   * Name of the browser's underlying engine.
   */
  engine?: BrowserEngines;

  /**
   * Version of the engine corresponding to the browser version.
   */
  engine_version?: string;

  /**
   * A property indicating where in the lifetime cycle this release is in.
   *
   * It's an enum accepting these values:
   * - `retired`: This release is no longer supported (EOL).
   * - `current`: This release is the official latest release.
   * - `exclusive`: This is an exclusive release (for example on a flagship device),
   *   not generally available.
   * - `beta`: This release will the next official release.
   * - `nightly`: This release is the current alpha / experimental release
   *   (like Firefox Nightly, Chrome Canary).
   * - `esr`: This release is an Extended Support Release.
   * - `planned`: This release is planned in the future.
   */
  status:
    | 'retired'
    | 'current'
    | 'limited'
    | 'beta'
    | 'nightly'
    | 'esr'
    | 'planned';
}

/**
 * The `support_statement` object describes the support provided
 * by a single browser type for the given sub-feature.
 *
 * It is an array of `simple_support_statement` objects, but if there
 * is only one of them, the array must be omitted.
 */
export type SupportStatement =
  | SimpleSupportStatement
  | SimpleSupportStatement[];
export type VersionValue = string | boolean | null;

/**
 * The `simple_support_statement` object is the core object containing the compatibility information for a browser.
 */
export interface SimpleSupportStatement {
  /** The version indicating when a sub-feature has been added (and is therefore supported).
   *
   * The `boolean` values indicate that a sub-feature is supported
   * (`true`, with the additional meaning that it is unknown in which version support was added)
   * or not supported (`false`).
   *
   * A value of `null` indicates that support information is entirely unknown.
   */
  version_added: VersionValue;

  /**
   * Contains a string with the version number the sub-feature was
   * removed in. It may also be a `boolean` value of (`true` or `false`),
   * or the `null` value.
   *
   * Default values:
   * - If `version_added` is set to `true`, `false`, or a string,
   *   `version_removed` defaults to `false`.
   * - if `version_added` is set to `null`, the default value
   *   of `version_removed` is also `null`.
   */
  version_removed?: VersionValue;

  /**
   * A prefix to add to the sub-feature name (defaults to empty string).
   *
   * Only non-standard vendor prefixes are permitted.
   *
   * Note that leading and trailing `-` must be included.
   */
  prefix?: string;

  /**
   * In some cases features are named entirely differently and not just prefixed,
   * or the prefix is an official non-vendor prefix.
   *
   * (eg. the official `grid-` prefixed aliases for the CSS `*-gap` properties).
   */
  alternative_name?: string;

  /**
   * An optional array of objects indicating what kind of flags must be set for this feature to work.
   * Usually this array will have one item, but there are cases where two or more flags can be required to activate a feature.
   */
  flags?: {
    /**
     * An enum that indicates the flag type:
     * - `preference` a flag the user can set (like in `about:config` in Firefox).
     * - `runtime_flag` a flag to be set before starting the browser.
     */
    type: 'preference' | 'runtime_flag';

    /**
     * A `string` representing the flag or preference to modify.
     */
    name: string;

    /**
     * Property representing the actual value to set the flag to.
     *
     * It is a string, that may be converted to the right type
     * (that is `true` or `false` for a `boolean` value, or `4` for a `number` value).
     *
     * It doesn't need to be enclosed in `<code>` tags.
     */
    value_to_set?: string;
  }[];
  /**
   * A `boolean` value indicating whether or not the implementation of the sub-feature follows
   * the current specification closely enough to not create major interoperability problems.
   *
   * It defaults to `false` (no interoperability problem expected).
   *
   * If set to `true`, it is recommended to add a note indicating how it diverges from
   * the standard (implements an old version of the standard, for example).
   */
  partial_implementation?: boolean;

  /**
   * An `array` of zero or more strings containing
   * additional information. If there is only one entry in the array,
   * the array must be omitted.
   *
   * The `<code>` and `<a>` HTML elements can be used.
   */
  notes?: string | string[];
}

export type Identifier = PrimaryIdentifier & IdentifierMeta;

export interface PrimaryIdentifier
  extends Record<Exclude<string, '__compat'>, Identifier> {}

interface IdentifierMeta {
  /**
   * A feature is described by an identifier containing the `__compat` property.
   *
   * In other words, identifiers without `__compat` aren't necessarily features,
   * but help to nest the features properly.
   *
   * When an identifier has a `__compat` block, it represents its basic support,
   * indicating that a minimal implementation of a functionality is included.
   *
   * What it represents exactly depends of the evolution of the feature over time,
   * both in terms of specifications and of browser support.
   */
  __compat?: CompatStatement;
}

export interface CompatStatement {
  /**
   * A string containing a human-readable description of the feature.
   *
   * It is intended to be used as a caption or title and should be kept short.
   *
   * The `<code>` and `<a>` HTML elements can be used.
   */
  description?: string;

  /**
   * URL which points to a MDN reference page documenting the feature.
   *
   * It needs to be a valid URL, and should be the language-⁠neutral URL
   * (e.g. use `https⁠://developer.mozilla.org/docs/Web/CSS/text-⁠align`
   * instead of `https⁠://developer.mozilla.org/en-⁠US/docs/Web/CSS/text-⁠align`).
   */
  mdn_url?: string;

  matches?: MatchesBlock;

  /**
   * Each `__compat` object contains support information.
   *
   * For each browser identifier, it contains a `support_statement` object with
   * information about versions, prefixes, or alternate names, as well as notes.
   */
  support: SupportBlock;

  /**
   * An object containing information about the stability of the feature:
   *
   * Is it a functionality that is standard? Is it stable?
   * Has it been deprecated and shouldn't be used anymore?
   */
  status?: StatusBlock;
}

export interface SupportBlock
  extends Partial<Record<BrowserNames, SupportStatement>>,
    Partial<Record<string, SupportStatement>> {}

export interface MatchesBlock {
  keywords?: string[];
  regex_token?: string;
  regex_value?: string;
}

/**
 * The status property contains information about stability of the feature.
 */
export interface StatusBlock {
  /**
   * `boolean` value that indicates this functionality is
   * intended to be an addition to the Web platform. Some features are added to
   * conduct tests.
   *
   * Set to `false`, it means the functionality is mature, and no
   * significant incompatible changes are expected in the future.
   */
  experimental: boolean;

  /**
   * `boolean` value indicating if the feature is part
   * of an active specification or specification process.
   */
  standard_track: boolean;

  /**
   * `boolean` value that indicates if the feature is no longer recommended.
   *
   * It might be removed in the future or might only be kept for compatibility purposes.
   * Avoid using this functionality.
   */
  deprecated: boolean;
}

export type CompatData = CompatDataBrowsers & CompatDataIdentifiers;

interface CompatDataBrowsers {
  /**
   * Contains data for each known browser.
   */
  browsers: Browsers;
}

interface CompatDataIdentifiers
  extends Record<Exclude<string, 'browsers'>, PrimaryIdentifier> {
  /**
   * Contains data for each [Web API](https://developer.mozilla.org/docs/Web/API)
   * interface.
   */
  api: PrimaryIdentifier;

  /**
   * Contains data for [CSS](https://developer.mozilla.org/docs/Web/CSS)
   * properties, selectors, and at-rules.
   */
  css: PrimaryIdentifier;

  /**
   * Contains data for [HTML](https://developer.mozilla.org/docs/Web/HTML)
   * elements, attributes, and global attributes.
   */
  html: PrimaryIdentifier;

  /**
   * Contains data for [HTTP](https://developer.mozilla.org/docs/Web/HTTP)
   * headers, statuses, and methods.
   */
  http: PrimaryIdentifier;

  /**
   * Contains data for [JavaScript](https://developer.mozilla.org/docs/Web/JavaScript)
   * built-in Objects, statement, operators, and other ECMAScript language features.
   */
  javascript: PrimaryIdentifier;

  /**
   * Contains data for [MathML](https://developer.mozilla.org/docs/Web/MathML)
   * elements, attributes, and global attributes.
   */
  mathml: PrimaryIdentifier;

  /**
   * Contains data for [SVG](https://developer.mozilla.org/docs/Web/SVG)
   * elements, attributes, and global attributes.
   */
  svg: PrimaryIdentifier;

  /**
   * Contains data for [WebDriver](https://developer.mozilla.org/docs/Web/WebDriver)
   * commands.
   */
  webdriver: PrimaryIdentifier;

  /**
   * Contains data for [WebExtensions](https://developer.mozilla.org/Add-ons/WebExtensions)
   * JavaScript APIs and manifest keys.
   */
  webextensions: PrimaryIdentifier;

  /**
   * Contains data for [XPath](https://developer.mozilla.org/docs/Web/XPath)
   * axes, and functions.
   */
  xpath: PrimaryIdentifier;

  /**
   * Contains data for [XSLT](https://developer.mozilla.org/docs/Web/XSLT)
   * elements, attributes, and global attributes.
   */
  xslt: PrimaryIdentifier;
}
