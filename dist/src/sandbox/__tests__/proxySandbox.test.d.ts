/**
 * @author Kuitos
 * @since 2020-03-31
 */
declare global {
    interface Window extends Record<string, any> {
        nonEnumerableValue: string;
    }
}
export {};
