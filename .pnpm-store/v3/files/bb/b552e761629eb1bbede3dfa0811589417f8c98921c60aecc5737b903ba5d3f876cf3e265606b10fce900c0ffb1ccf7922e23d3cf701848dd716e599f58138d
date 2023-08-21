export function is_object(obj: unknown): boolean;
export function is_object_literal(obj: unknown): boolean;
export function compare(el1: unknown, el2: unknown): boolean;
export function clone<T>(target: T): T;

type Merge<T extends object[]> = T extends [
  infer Head extends object,
  ...infer Tail extends object[]
]
  ? Tail extends []
    ? Head
    : Merge<
        [
          MergeObjects<Head, Tail[0]>,
          ...(Tail extends [infer _, ...infer Rest] ? Rest : [])
        ]
      >
  : never;

// type MergeObjects<T extends object, U extends object> = {
//   [K in keyof T | keyof U]: K extends keyof T & keyof U
//     ? T[K] extends object
//       // Could simplify the code but type negation doesn't seem to work, see
//       // https://github.com/microsoft/TypeScript/issues/4196
//       // https://github.com/microsoft/TypeScript/pull/29317
//       // https://github.com/microsoft/TypeScript/issues/4196
//       ? U[K] extends object & !Buffer
//         ? MergeObjects<T[K], U[K]>
//         : T[K]
//       : U[K]
//     : K extends keyof T
//     ? T[K]
//     : K extends keyof U
//     ? U[K]
//     : never;
// };

type MergeObjects<T extends object, U extends object> = {
  [K in keyof T | keyof U]: K extends keyof T & keyof U
    ? T[K] extends object
      ? U[K] extends Buffer
        ? T[K]
        : U[K] extends object
          ? MergeObjects<T[K], U[K]>
          : T[K]
      : U[K]
    : K extends keyof T
    ? T[K]
    : K extends keyof U
    ? U[K]
    : never;
};

export function merge<T extends object[]>(...args: T): Merge<T>;
export function mutate<T extends object[]>(...args: T): Merge<T>;

type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Uppercase<T> ? "_" : ""}${Lowercase<T>}${SnakeCase<U>}`
  : S;

type SnakeCaseKeys<T> = T extends Array<infer U>
  ? Array<SnakeCaseKeys<U>>
  : T extends object
  ? {
      [K in keyof T as SnakeCase<string & K>]: SnakeCaseKeys<T[K]>;
    }
  : T;

export function snake_case<T extends Record<string, any>>(
  source: T,
  convert?: boolean | number
): SnakeCaseKeys<T>;
