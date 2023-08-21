import { SpyInternalImpl } from 'tinyspy';

interface MockResultReturn<T> {
    type: 'return';
    value: T;
}
interface MockResultIncomplete {
    type: 'incomplete';
    value: undefined;
}
interface MockResultThrow {
    type: 'throw';
    value: any;
}
type MockResult<T> = MockResultReturn<T> | MockResultThrow | MockResultIncomplete;
interface MockContext<TArgs, TReturns> {
    calls: TArgs[];
    instances: TReturns[];
    invocationCallOrder: number[];
    results: MockResult<TReturns>[];
    lastCall: TArgs | undefined;
}
type Procedure = (...args: any[]) => any;
type Methods<T> = {
    [K in keyof T]: T[K] extends Procedure ? K : never;
}[keyof T] & (string | symbol);
type Properties<T> = {
    [K in keyof T]: T[K] extends Procedure ? never : K;
}[keyof T] & (string | symbol);
type Classes<T> = {
    [K in keyof T]: T[K] extends new (...args: any[]) => any ? K : never;
}[keyof T] & (string | symbol);
interface SpyInstance<TArgs extends any[] = any[], TReturns = any> {
    getMockName(): string;
    mockName(n: string): this;
    mock: MockContext<TArgs, TReturns>;
    mockClear(): this;
    mockReset(): this;
    mockRestore(): void;
    getMockImplementation(): ((...args: TArgs) => TReturns) | undefined;
    mockImplementation(fn: ((...args: TArgs) => TReturns) | (() => Promise<TReturns>)): this;
    mockImplementationOnce(fn: ((...args: TArgs) => TReturns) | (() => Promise<TReturns>)): this;
    withImplementation<T>(fn: ((...args: TArgs) => TReturns), cb: () => T): T extends Promise<unknown> ? Promise<this> : this;
    mockReturnThis(): this;
    mockReturnValue(obj: TReturns): this;
    mockReturnValueOnce(obj: TReturns): this;
    mockResolvedValue(obj: Awaited<TReturns>): this;
    mockResolvedValueOnce(obj: Awaited<TReturns>): this;
    mockRejectedValue(obj: any): this;
    mockRejectedValueOnce(obj: any): this;
}
interface MockInstance<A extends any[] = any[], R = any> extends SpyInstance<A, R> {
}
interface Mock<TArgs extends any[] = any, TReturns = any> extends SpyInstance<TArgs, TReturns> {
    new (...args: TArgs): TReturns;
    (...args: TArgs): TReturns;
}
interface PartialMock<TArgs extends any[] = any, TReturns = any> extends SpyInstance<TArgs, TReturns extends Promise<Awaited<TReturns>> ? Promise<Partial<Awaited<TReturns>>> : Partial<TReturns>> {
    new (...args: TArgs): TReturns;
    (...args: TArgs): TReturns;
}
type MaybeMockedConstructor<T> = T extends new (...args: Array<any>) => infer R ? Mock<ConstructorParameters<T>, R> : T;
type MockedFunction<T extends Procedure> = Mock<Parameters<T>, ReturnType<T>> & {
    [K in keyof T]: T[K];
};
type PartiallyMockedFunction<T extends Procedure> = PartialMock<Parameters<T>, ReturnType<T>> & {
    [K in keyof T]: T[K];
};
type MockedFunctionDeep<T extends Procedure> = Mock<Parameters<T>, ReturnType<T>> & MockedObjectDeep<T>;
type PartiallyMockedFunctionDeep<T extends Procedure> = PartialMock<Parameters<T>, ReturnType<T>> & MockedObjectDeep<T>;
type MockedObject<T> = MaybeMockedConstructor<T> & {
    [K in Methods<T>]: T[K] extends Procedure ? MockedFunction<T[K]> : T[K];
} & {
    [K in Properties<T>]: T[K];
};
type MockedObjectDeep<T> = MaybeMockedConstructor<T> & {
    [K in Methods<T>]: T[K] extends Procedure ? MockedFunctionDeep<T[K]> : T[K];
} & {
    [K in Properties<T>]: MaybeMockedDeep<T[K]>;
};
type MaybeMockedDeep<T> = T extends Procedure ? MockedFunctionDeep<T> : T extends object ? MockedObjectDeep<T> : T;
type MaybePartiallyMockedDeep<T> = T extends Procedure ? PartiallyMockedFunctionDeep<T> : T extends object ? MockedObjectDeep<T> : T;
type MaybeMocked<T> = T extends Procedure ? MockedFunction<T> : T extends object ? MockedObject<T> : T;
type MaybePartiallyMocked<T> = T extends Procedure ? PartiallyMockedFunction<T> : T extends object ? MockedObject<T> : T;
interface Constructable {
    new (...args: any[]): any;
}
type MockedClass<T extends Constructable> = MockInstance<T extends new (...args: infer P) => any ? P : never, InstanceType<T>> & {
    prototype: T extends {
        prototype: any;
    } ? Mocked<T['prototype']> : never;
} & T;
type Mocked<T> = {
    [P in keyof T]: T[P] extends (...args: infer Args) => infer Returns ? MockInstance<Args, Returns> : T[P] extends Constructable ? MockedClass<T[P]> : T[P];
} & T;
type EnhancedSpy<TArgs extends any[] = any[], TReturns = any> = SpyInstance<TArgs, TReturns> & SpyInternalImpl<TArgs, TReturns>;
declare const spies: Set<SpyInstance<any[], any>>;
declare function isMockFunction(fn: any): fn is EnhancedSpy;
declare function spyOn<T, S extends Properties<Required<T>>>(obj: T, methodName: S, accessType: 'get'): SpyInstance<[], T[S]>;
declare function spyOn<T, G extends Properties<Required<T>>>(obj: T, methodName: G, accessType: 'set'): SpyInstance<[T[G]], void>;
declare function spyOn<T, M extends (Classes<Required<T>> | Methods<Required<T>>)>(obj: T, methodName: M): Required<T>[M] extends ({
    new (...args: infer A): infer R;
}) | ((...args: infer A) => infer R) ? SpyInstance<A, R> : never;
declare function fn<TArgs extends any[] = any, R = any>(): Mock<TArgs, R>;
declare function fn<TArgs extends any[] = any[], R = any>(implementation: (...args: TArgs) => R): Mock<TArgs, R>;

export { EnhancedSpy, MaybeMocked, MaybeMockedConstructor, MaybeMockedDeep, MaybePartiallyMocked, MaybePartiallyMockedDeep, Mock, MockContext, MockInstance, Mocked, MockedClass, MockedFunction, MockedFunctionDeep, MockedObject, MockedObjectDeep, PartialMock, PartiallyMockedFunction, PartiallyMockedFunctionDeep, SpyInstance, fn, isMockFunction, spies, spyOn };
