export declare type ArgsType<T extends (...args: any[]) => any> = T extends (...args: infer U) => any ? U : never;
export declare type PartialKeys<T> = Exclude<{
    [U in keyof T]: undefined extends T[U] ? U : never;
}[keyof T], undefined>;
export declare type PartialProps<T> = Pick<T, PartialKeys<T>>;
export declare type NodeEnv = 'development' | 'production' | 'test';
export declare type Omit<T, U> = Pick<T, Exclude<keyof T, U>>;
