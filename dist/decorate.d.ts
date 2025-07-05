export type SrcFunction = Function | null | undefined;
export type FunctionDecoration = (srcFunc: SrcFunction, ...args: any[]) => any;
export type ThisType = any;
export type ThisArg = any;
export declare const NAME_SYM: unique symbol;
export default function decorate(srcFunc: SrcFunction, decoration: FunctionDecoration, argThis?: ThisArg): {
    (this: ThisType, ...args: any[]): any;
    [NAME_SYM]: string | undefined;
};
export { decorate };
