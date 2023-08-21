type QueryValue = string | number | undefined | null | boolean | Array<QueryValue> | Record<string, any>;
type QueryObject = Record<string, QueryValue | QueryValue[]>;
type ParsedQuery = Record<string, string | string[]>;
declare function parseQuery<T extends ParsedQuery = ParsedQuery>(parametersString?: string): T;
declare function encodeQueryItem(key: string, value: QueryValue | QueryValue[]): string;
declare function stringifyQuery(query: QueryObject): string;

/**
 * Encode characters that need to be encoded on the path, search and hash
 * sections of the URL.
 *
 * @internal
 * @param text - string to encode
 * @returns encoded string
 */
declare function encode(text: string | number): string;
/**
 * Encode characters that need to be encoded on the hash section of the URL.
 *
 * @param text - string to encode
 * @returns encoded string
 */
declare function encodeHash(text: string): string;
/**
 * Encode characters that need to be encoded query values on the query
 * section of the URL.
 *
 * @param input - string to encode
 * @returns encoded string
 */
declare function encodeQueryValue(input: QueryValue): string;
/**
 * Like `encodeQueryValue` but also encodes the `=` character.
 *
 * @param text - string to encode
 */
declare function encodeQueryKey(text: string | number): string;
/**
 * Encode characters that need to be encoded on the path section of the URL.
 *
 * @param text - string to encode
 * @returns encoded string
 */
declare function encodePath(text: string | number): string;
/**
 * Encode characters that need to be encoded on the path section of the URL as a
 * param. This function encodes everything {@link encodePath} does plus the
 * slash (`/`) character.
 *
 * @param text - string to encode
 * @returns encoded string
 */
declare function encodeParam(text: string | number): string;
/**
 * Decode text using `decodeURIComponent`. Returns the original text if it
 * fails.
 *
 * @param text - string to decode
 * @returns decoded string
 */
declare function decode(text?: string | number): string;
/**
 * Decode path section of URL (consistent with encodePath for slash encoding).
 *
 * @param text - string to decode
 * @returns decoded string
 */
declare function decodePath(text: string): string;
/**
 * Decode query key (consistent with encodeQueryKey for plus encoding).
 * Created different method for decoding key to avoid future changes on value encode/decode.
 * @param text - string to decode
 * @returns decoded string
 */
declare function decodeQueryKey(text: string): string;
/**
 * Decode query value (consistent with encodeQueryValue for plus encoding).
 *
 * @param text - string to decode
 * @returns decoded string
 */
declare function decodeQueryValue(text: string): string;
declare function encodeHost(name?: string): string;

interface ParsedURL {
    protocol?: string;
    host?: string;
    auth?: string;
    pathname: string;
    hash: string;
    search: string;
}
interface ParsedAuth {
    username: string;
    password: string;
}
interface ParsedHost {
    hostname: string;
    port: string;
}
/**
 * It takes a URL string and returns an object with the URL's protocol, auth, host, pathname, search,
 * and hash
 * @param [input] - The URL to parse.
 * @param [defaultProto] - The default protocol to use if the input doesn't have one.
 * @returns A parsed URL object.
 */
declare function parseURL(input?: string, defaultProto?: string): ParsedURL;
/**
 * It splits the input string into three parts, and returns an object with those three parts
 * @param [input] - The URL to parse.
 * @returns An object with three properties: `pathname`, `search`, and `hash`.
 */
declare function parsePath(input?: string): ParsedURL;
/**
 * It takes a string of the form `username:password` and returns an object with the username and
 * password decoded
 * @param [input] - The URL to parse.
 * @returns An object with two properties: username and password.
 */
declare function parseAuth(input?: string): ParsedAuth;
/**
 * It takes a string, and returns an object with two properties: `hostname` and `port`
 * @param [input] - The URL to parse.
 * @returns A function that takes a string and returns an object with two properties: `hostname` and
 * `port`.
 */
declare function parseHost(input?: string): ParsedHost;
/**
 * It takes a `ParsedURL` object and returns the stringified URL
 * @param [parsed] - The parsed URL
 * @returns A stringified URL.
 */
declare function stringifyParsedURL(parsed: ParsedURL): string;
declare function parseFilename(input: string, { strict }: {
    strict: any;
}): string | undefined;

declare class $URL implements URL {
    protocol: string;
    host: string;
    auth: string;
    pathname: string;
    query: QueryObject;
    hash: string;
    constructor(input?: string);
    get hostname(): string;
    get port(): string;
    get username(): string;
    get password(): string;
    get hasProtocol(): number;
    get isAbsolute(): number | boolean;
    get search(): string;
    get searchParams(): URLSearchParams;
    get origin(): string;
    get fullpath(): string;
    get encodedAuth(): string;
    get href(): string;
    append(url: $URL): void;
    toJSON(): string;
    toString(): string;
}

declare function isRelative(inputString: string): boolean;
interface HasProtocolOptions {
    acceptRelative?: boolean;
    strict?: boolean;
}
declare function hasProtocol(inputString: string, opts?: HasProtocolOptions): boolean;
/**
 * @deprecated
 * Same as { hasProtocol(inputString, { acceptRelative: true })
 */
declare function hasProtocol(inputString: string, acceptRelative: boolean): boolean;
declare function isScriptProtocol(protocol?: string): boolean;
declare function hasTrailingSlash(input?: string, queryParameters?: boolean): boolean;
declare function withoutTrailingSlash(input?: string, queryParameters?: boolean): string;
declare function withTrailingSlash(input?: string, queryParameters?: boolean): string;
declare function hasLeadingSlash(input?: string): boolean;
declare function withoutLeadingSlash(input?: string): string;
declare function withLeadingSlash(input?: string): string;
declare function cleanDoubleSlashes(input?: string): string;
declare function withBase(input: string, base: string): string;
declare function withoutBase(input: string, base: string): string;
declare function withQuery(input: string, query: QueryObject): string;
declare function getQuery<T extends ParsedQuery = ParsedQuery>(input: string): T;
declare function isEmptyURL(url: string): boolean;
declare function isNonEmptyURL(url: string): boolean;
declare function joinURL(base: string, ...input: string[]): string;
declare function withHttp(input: string): string;
declare function withHttps(input: string): string;
declare function withoutProtocol(input: string): string;
declare function withProtocol(input: string, protocol: string): string;
declare function createURL(input: string): $URL;
declare function normalizeURL(input: string): string;
declare function resolveURL(base: string, ...input: string[]): string;
declare function isSamePath(p1: string, p2: string): boolean;
interface CompareURLOptions {
    trailingSlash?: boolean;
    leadingSlash?: boolean;
    encoding?: boolean;
}
declare function isEqual(a: string, b: string, options?: CompareURLOptions): boolean;

export { $URL, HasProtocolOptions, ParsedAuth, ParsedHost, ParsedQuery, ParsedURL, QueryObject, QueryValue, cleanDoubleSlashes, createURL, decode, decodePath, decodeQueryKey, decodeQueryValue, encode, encodeHash, encodeHost, encodeParam, encodePath, encodeQueryItem, encodeQueryKey, encodeQueryValue, getQuery, hasLeadingSlash, hasProtocol, hasTrailingSlash, isEmptyURL, isEqual, isNonEmptyURL, isRelative, isSamePath, isScriptProtocol, joinURL, normalizeURL, parseAuth, parseFilename, parseHost, parsePath, parseQuery, parseURL, resolveURL, stringifyParsedURL, stringifyQuery, withBase, withHttp, withHttps, withLeadingSlash, withProtocol, withQuery, withTrailingSlash, withoutBase, withoutLeadingSlash, withoutProtocol, withoutTrailingSlash };
