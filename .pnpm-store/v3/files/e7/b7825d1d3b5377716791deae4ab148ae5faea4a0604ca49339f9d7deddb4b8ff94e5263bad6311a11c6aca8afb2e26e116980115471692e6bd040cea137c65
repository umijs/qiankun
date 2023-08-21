export declare class BitField {
    protected static MAXBIT: number;
    protected static next: number;
    protected static names: Map<string, number>;
    protected bits: number;
    static allocate(...names: string[]): void;
    static has(name: string): boolean;
    set(name: string): void;
    clear(name: string): void;
    isSet(name: string): boolean;
    reset(): void;
    protected getBit(name: string): number;
}
export declare function BitFieldClass(...names: string[]): typeof BitField;
