/**
 * @author Kuitos
 * @since 2023-05-04
 */
export type Rebuild = (container: HTMLElement) => Promise<void>;
export type Free = () => Rebuild;
export type Patch = () => Free;
